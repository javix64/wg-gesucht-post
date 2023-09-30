import { chromium } from "playwright-chromium";
import { existsSync, readFile, readFileSync, writeFileSync } from "fs";
import {
  saveUrlsInFile,
  extractNumberOfOffers,
  transformMessage,
  popAndSaveFile,
  isFileEmpty,
  deleteUrlsBeforeStart,
  checkIfContactIsOnFile,
  replaceOfferUrlForSendMessageUrl,
} from "./helper.js";
import data from "./.tmp/data.js";
export class WGgesucht {
  constructor() {
    this.fileCookies = new URL(".tmp/cookies.json", import.meta.url).pathname;
    this.baseUrl = "https://www.wg-gesucht.de/";
    this.data = data;
    this.context, this.page;
  }

  async launchChromium() {
    const browser = await chromium.launch({
      headless: false,
    });
    this.context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0",
    });

    this.page = await this.context.newPage();
  }
  // Wg Gesucht
  async navigateToWgGesucht(username, password) {
    if (this.loadCookies() == true) {
      await this.page.goto(this.baseUrl);
    } else {
      await this.page.goto(this.baseUrl);
      await this.acceptCookies();
      await this.login(username, password);
      const cookies = await this.context.cookies();
      this.saveCookies(cookies);
    }
  }
  async acceptCookies() {
    const modalCookies = "cmpbox";
    const buttonAcceptCookies = "#cmpwelcomebtnyes";
    const isVisible = await this.page.getByRole("div", { name: modalCookies });
    if (!isVisible) return "Not found";
    await this.page.locator(buttonAcceptCookies).click();
  }
  async login(username, password) {
    await this.page.evaluate(() => fireLoginOrRegisterModalRequest("sign_in"));
    const usernameInput = "#login_email_username";
    const passwordInput =
      "div.col-md-12:nth-child(2) > div:nth-child(2) > input:nth-child(1)";
    const loginButton = "#login_submit";
    if (!username && !password) {
      await this.page
        .locator(usernameInput)
        .fill(process.env.WG_GESUCHT_USERNAME);
      await this.page
        .locator(passwordInput)
        .fill(process.env.WG_GESUCHT_PASSWORD);
    }
    await this.page.locator(usernameInput).fill(username);
    await this.page.locator(passwordInput).fill(password);
    await this.page.locator(loginButton).click();
  }
  // Receiving a post from server
  async loopOffers(url, message) {
    console.info("Starting...");
    const { url:urlSaved, message:messageSaved } = this.data;
    await this.page.waitForTimeout(5000);
    deleteUrlsBeforeStart();
    if(!url)await this.page.goto(urlSaved);
    else await this.page.goto(url)
    const h1 = await this.page.locator("h1").textContent();
    console.info("Number of ads", extractNumberOfOffers(h1));
    const pages = await this.totalPages();
    // loop to get all ads.
    let currentPage = 0;
    do {
      await this.iteratePages(this.page);
      currentPage += 1;
      console.info(currentPage);
    } while (currentPage < pages);
    //example how looks formatted message
    do {
      const adUrlMessage = await popAndSaveFile();
      await this.page.goto(adUrlMessage);
      await this.skipCatchaMiddleware();
      if(!message)await this.onSendMessage(messageSaved);
      else await this.onSendMessage(message);
      await this.page.waitForTimeout(5000);
    } while (isFileEmpty() > 0);
    // finish
    await this.page.waitForTimeout(10000);
    console.info("Finished");
    await browser.close();
  }
  // launc this function when an email is Received
  async onEmailReceive(url) {
    // check if email has one or more than one url
    // https://www.wg-gesucht.de/en/nachricht-senden https://www.wg-gesucht.de/10533332.html
    console.info('')
    const urlMessage = replaceOfferUrlForSendMessageUrl(url);
    await this.page.goto(urlMessage);
    await this.onSendMessage(this.data.message);
    await this.page.close();
  }
  // Utils
  loadCookies() {
    if (!existsSync(this.fileCookies)) return false;
    const cookiesFile = readFileSync(this.fileCookies);
    if (
      cookiesFile.toJSON().data.length != 0 &&
      typeof JSON.parse(cookiesFile) &&
      Array.isArray(JSON.parse(cookiesFile))
    ) {
      this.context.addCookies(JSON.parse(cookiesFile));
      return true;
    }
  }
  saveCookies(cookies) {
    writeFileSync(this.fileCookies, JSON.stringify(cookies));
  }
  async totalPages() {
    const h1 = await this.page.locator("h1").textContent();
    const numberOfOffers = extractNumberOfOffers(h1);
    const totalPages = Math.ceil(numberOfOffers / 20);
    return totalPages;
  }
  async getAdsListView() {
    const arrayUrls = [];
    const tr = await this.page.locator("tr").all();
    const allTr = await Promise.all(
      tr.map(async (ad) => {
        const lastUrl = await ad.getAttribute("adid");
        if (lastUrl != null) {
          const sendMessageUrl =
            "https://www.wg-gesucht.de/en/nachricht-senden/";
          arrayUrls.push(`${sendMessageUrl}${lastUrl}`);
        }
      })
    );
    return arrayUrls;
  }

  async getAdsDetailView() {
    const arrayUrls = [];
    const tr = await this.page.locator("div[data-id]").all();
    const allTr = await Promise.all(
      tr.map(async (ad) => {
        const textAd = await ad.locator("xpath=/div/div[1]").innerText();
        // const textAd2 = await ad.locator('xpath=/div/div[2]/div[3]/div[2]/div[2]/div/span[1]').innerText();
        const adHref = await ad
          .locator("xpath=/div/div[1]/a")
          .getAttribute("href");
        const combinedUrl = replaceOfferUrlForSendMessageUrl(adHref);
        if (!textAd.includes("contacted")) arrayUrls.push(combinedUrl);
      })
    );
    return arrayUrls;
  }

  async skipCatchaMiddleware() {
    let url = await this.page.url();
    let newUrl = "";
    const stringCaptcha = "en/cuba.html?page=/";
    if (!url.includes(stringCaptcha)) return;
    do {
      newUrl = url.replace(stringCaptcha, "");
      await this.page.waitForTimeout(1000);
      await this.page.goto(newUrl);
    } while (newUrl.includes(stringCaptcha));
  }

  async iteratePages() {
    // const listAds = await getAdsListView(page);
    await this.skipCatchaMiddleware(this.page);
    const listAds = await this.getAdsDetailView(this.page);
    const nextPageButton = await this.page
      .locator("#assets_list_pagination > ul:nth-child(1) > li:last-child")
      .click();
    await this.page.waitForLoadState("domcontentloaded");
    saveUrlsInFile(listAds);
  }

  async getNameFromAd() {
    const textNotFormatted = await this.page
      .locator(".control-label")
      .textContent();
    const textFormatted = textNotFormatted
      .replace("Send message to ", "")
      .replace(":", "")
      .replace(/[\n\r]+|[\s]{2,}/g, " ")
      .replaceAll("  ", "");
    return textFormatted;
  }

  async closeModalOnMessage() {
    const acceptButtonId = "#sicherheit_bestaetigung";
    if (await this.page.locator(acceptButtonId).isVisible()) {
      await this.page.locator(acceptButtonId).click();
    }
  }

  async onSendMessage(msg) {
    await this.closeModalOnMessage();
    const countLabels = await this.page.locator(".control-label").count();
    if (countLabels > 1) {
      console.info("AlreadySend it");
      return;
    }
    const isMessaged = await this.page.locator(".control-label").isVisible();
    const name = await this.getNameFromAd();
    // Check if user was contacted, if it was, pass to the next one.
    if (checkIfContactIsOnFile(name) != true) return;
    const message = await transformMessage(msg, name);
    const textArea = await this.page.locator("#message_input").fill(message);
    // const onClickSendButton = await this.page
    //   .locator("button.create_new_conversation:nth-child(1)")
    //   .click();
    this.page.waitForTimeout(10000);
    console.info("Message send it!");
  }

  async checkIfUserContactedHasCreatedAnotherOffer() {
    await this.page.goto(
      "https://www.wg-gesucht.de/en/nachrichten.html?filter_type=7"
    );
    const allNames = [];
    let currentPage = 0;
    const lastPage = parseInt(
      await this.page
        .locator(
          "#pagination_container > ul:nth-child(1) > li:nth-last-child(2)"
        )
        .innerText()
    );
    // loop
    do {
      const usersContacted = await this.page
        .locator(".list_item_public_name")
        .all();
      const allUsersContacted = await Promise.all(
        usersContacted.map(async (user) => {
          const userName = await user.innerText();
          allNames.push(userName);
        })
      );
      await this.page
        .locator("#pagination_container > ul:nth-child(1) > li:last-child")
        .click();
      await this.page.waitForLoadState("domcontentloaded");
      currentPage += 1;
    } while (currentPage < lastPage);
    saveInFile(allNames);
  }
}

// test
// const wg = new WGgesucht();

// (async function () {
//   await wg.launchChromium();
//   await wg.navigateToWgGesucht();
//   await wg.loopOffers();
// })();
