import Koa from "koa";
import Router from "koa-router";
import { bodyParser} from "@koa/bodyparser";
import {wgGesucht} from "../scraping/wg-gesucht/index.js";
import cors from '@koa/cors';

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
      const data =ctx.request.body;
      await new Promise(async (res,rej)=>{
        await wgGesucht(data);
        res(ctx.body='done');
      })
    });
    // Methods not allowed in the rest of paths.
    this.router.get(/(.*)/, (ctx, next) => {
      this.notFoundUrl(ctx);
    }).post(/(.*)/, (ctx, next) => {
      this.notFoundUrl(ctx);
    }).put(/(.*)/, (ctx, next) => {
      this.notFoundUrl(ctx);
    }).delete(/(.*)/, (ctx, next) => {
      this.notFoundUrl(ctx);
    });
    return this.router.routes();
  }
  middlewares() {
    this.app.use(cors());
    this.app.use(bodyParser());
    this.app.use(this.routes());
  }
  notFoundUrl(ctx){
    ctx.res.statusCode=404;
    ctx.body = "Not found :)";
  }
  start() {
    this.app
    .listen(this.port)
    .timeout=1000*600
    console.info("app started");
  }
}