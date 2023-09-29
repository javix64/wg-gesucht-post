import { chromium } from "playwright-chromium";
import { startTransition } from "react";
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
  skipCatchaMiddleware,
} from "./helper.js";
const BASEURL = "https://www.wg-gesucht.de/";

export const wgGesucht = async (data) => {
  // config playwright
  console.info("Starting...");
  const {email, password, url, msg} = data;
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0",
  });
  const page = await context.newPage();
  // login
  await page.goto(BASEURL);
  await skipCatchaMiddleware(page);
  await acceptCookies(page);
  await login(email, password, page);
  await page.waitForTimeout(5000);
  deleteUrlsBeforeStart();
  // await checkIfUserContactedHasCreatedAnotherOffer(page);
  // obtain current url;
  await page.goto(url);
  await skipCatchaMiddleware(page);
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
    await skipCatchaMiddleware(page);
    await onSendMessage(page, msg);
    await page.waitForTimeout(5000);
  } while (isFileEmpty() > 0);
  // finish
  await page.waitForTimeout(10000);
  console.info('Finished');
  await browser.close();
  // ToDo: need return some data save, as:
  // - total ads
  // - Many people contacted
};

export const wgGesuchtEmail = async (url) => {
  
}