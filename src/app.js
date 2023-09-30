import { Server } from "./server/index.js";
import { Email } from "./scraping/wg-gesucht/email.js";

const server = new Server();
new Email();
server.start();
