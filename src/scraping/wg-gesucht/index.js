import dotenv from 'dotenv';
dotenv.config();
import { chromium } from "playwright-chromium";
import {
  acceptCookies,
  getAdsListView,
  login,
  totalPages,
  saveUrlsInFile,
  iteratePages,
  extractNumberOfOffers,
  transformMessage,
  closeModalOnMessage,
  popAndSaveFile,
  onSendMessage,
  isFileEmpty,
  getAdsDetailView,
  deleteUrlsBeforeStart,
  checkIfUserContactedHasCreatedAnotherOffer,
} from "./helper.js";
const BASEURL = "https://www.wg-gesucht.de/";

const start = async () => {
  // config playwright
  console.info("Starting...");
  const { WG_GESUCHT_USERNAME, WG_GESUCHT_PASSWORD, WG_GESUCHT_URL } = process.env;
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
  });
  const page = await context.newPage();
  // login
  await page.goto(BASEURL);
  await acceptCookies(page);
  await login(WG_GESUCHT_USERNAME, WG_GESUCHT_PASSWORD, page);
  await page.waitForTimeout(5000);
  const injectCaptcha = await page.evaluate(() => {
    window.localStorage.setItem(
      "_grecaptcha",
      "09AHJ_tr7tHAQY2-ggrUFUtjk1LwJShRxXpQSmJAPJWi_fdtmUk37ZdvfP1ObD6fjBwgQhcWqvz9E2cBAxyP0pd0BNYdsxTszwzY-HHg"
    );
  });
  // await checkIfUserContactedHasCreatedAnotherOffer(page);
  // obtain current url;
  await page.goto(WG_GESUCHT_URL);
  deleteUrlsBeforeStart();
  const h1 = await page.locator("h1").textContent();
  console.info("Number of ads", extractNumberOfOffers(h1));
  const pages = await totalPages(page);
  // loop to get all ads.
  let currentPage = 0;
  do {
    await iteratePages(page);
    currentPage += 1;
    console.info(currentPage);
  } while (currentPage < pages);
  //example how looks formatted message
  do {
    const adUrlMessage = await popAndSaveFile();
    await page.goto(adUrlMessage);
    await onSendMessage(page);
    await page.waitForTimeout(5000);
  } while (isFileEmpty() > 0);
  // finish
  await page.waitForTimeout(10000);
  await browser.close();
};
start();