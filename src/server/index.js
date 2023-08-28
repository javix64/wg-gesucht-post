import Koa from 'koa';
import json from 'koa-json';
import Router from 'koa-router';

class Server {
  constructor(){
    this.app = new Koa();
    this.router = new Router();
    this.port = 3000;
    this.paths={
      api:  '/api/',
    }
    // this.app.use();
    this.middlewares();
  }
  routes(){
    this.router.get(this.paths.api, async (ctx, next) => {
      ctx.body = 'Hello World!';
    });
    this.router.routes();
    
  }
  middlewares(){
    this.app.use(json());
  }
  start(){
    this.app.listen(this.port)
    console.info('app started');
  }
}
const server = new Server();
server.start();