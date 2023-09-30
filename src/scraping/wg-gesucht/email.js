import { simpleParser } from "mailparser";
// import {onSendMessage} from './helper.js'
import Imap from "imap";
import { WGgesucht } from "./index.js";
export class Email {
  constructor() {
    this.getEmailsFromWGGesucht();
  }
  getEmailsFromWGGesucht() {
    try {
      const self = this;
      const imap = new Imap({
        user: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
        host: process.env.EMAIL_HOST,
        port: 143,
        tls: false,
        keepalive: {
          interval: 10000,
          idleInterval: 10000,
          forceNoop: true,
        },
      });
      imap.connect();
      imap.once("ready", () => {
        imap.openBox("INBOX", false, (a) => {
          imap.on("mail", function (msg) {
            imap.search(
              ["UNSEEN", ["FROM", process.env.MY_EMAIL]],
              (err, results) => {
                if (err) throw err;
                else if (!results || !results.length) {
                  console.log("no emails");
                } else {
                  const f = imap.fetch(results, { bodies: "", markSeen: true });
                  f.on("message", (msg) => {
                    msg.on("body", (stream) => {
                      simpleParser(stream, async (err, parsed) => {
                        const { textAsHtml } = parsed;
                        const url = self.extractHref(textAsHtml);
                        if (url === null) return;
                        const wg = new WGgesucht();
                        await wg.launchChromium();
                        await wg.navigateToWgGesucht();
                        await wg.onEmailReceive(url);
                      });
                    });
                  });
                  f.once("end", () => {
                    console.log("Done fetching all messages!");
                  });
                }
              }
            );
          });
        });
      });
    } catch (e) {
      console.log("error", e.message);
    }
  }
  extractHref(msgBody) {
    const regex = /VIEW OFFER &lt;<a href="([^"]+)"/;
    const match = msgBody.match(regex);
    if (match && match[1]) {
      const url = match[1].replace("?campaign=suchauftrag_detail", "");
      return url;
    } else {
      return null; // Return null if no match is found
    }
  }
}
