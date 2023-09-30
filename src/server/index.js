import "dotenv/config.js";
import Koa from "koa";
import Router from "koa-router";
import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import { WGgesucht } from "../scraping/wg-gesucht/index.js";
export class Server {
  constructor() {
    this.app = new Koa();
    this.router = new Router();
    this.port = 3000;
    this.middlewares();
  }
  routes() {
    // Only method allowed in root.
    this.router.post("/", async (ctx, next) => {
      // pass data for start
      const {email, password, url, msg} = ctx.request.body;
      await new Promise(async (res, rej) => {
        const wg = new WGgesucht();
        await wg.launchChromium();
        if(email.length==0){
          await wg.navigateToWgGesucht();
          await wg.loopOffers();
        }
        await wg.navigateToWgGesucht(email,password);
        await wg.loopOffers(url,msg);
      });
    });
    // Methods not allowed in the rest of paths.
    this.router
      .get(/(.*)/, (ctx) => {
        this.notFoundUrl(ctx);
      })
      .post(/(.*)/, (ctx) => {
        this.notFoundUrl(ctx);
      })
      .put(/(.*)/, (ctx) => {
        this.notFoundUrl(ctx);
      })
      .delete(/(.*)/, (ctx) => {
        this.notFoundUrl(ctx);
      });
    return this.router.routes();
  }
  middlewares() {
    this.app.use(cors());
    this.app.use(bodyParser());
    this.app.use(this.routes());
  }
  notFoundUrl(ctx) {
    ctx.res.statusCode = 404;
    ctx.body = "Not found :)";
  }
  start() {
    this.app.listen(this.port).timeout = 1000 * 600;
    console.info("app started");
  }
}
