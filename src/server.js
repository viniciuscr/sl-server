import Koa from "koa";
import Router from "koa-router";
import Logger from "koa-logger";
import Cors from "@koa/cors";
import BodyParser from "koa-bodyparser";
import Helmet from "koa-helmet";
import respond from "koa-respond";
import jwt from "koa-jwt";
import errorEvent from "./events/error";

const app = new Koa();
const router = new Router();

//set extra security headers
app.use(Helmet());
//Adds useful methods to Koa context.
app.use(respond());

process.env.NODE_ENV === "development" && app.use(Logger());

//Handle Errors
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit("error", err, ctx);
  }
});

app.use(Cors());
app.use(
  BodyParser({
    enableTypes: ["json"],
    jsonLimit: "5mb",
    strict: true,
    onerror: (err, ctx) => {
      ctx.throw("body parse error", 422);
    }
  })
);

app.use(
  jwt({ secret: process.env.SECRET_KEY }).unless({
    path: [/^\/v[\d]{1,2}\/user\/[login|register]/]
  })
);

//Events
app.on("error", errorEvent);

// API routes
require("./routes").default(router);
app.use(router.routes());
app.use(router.allowedMethods());

// eslint-disable-next-line no-console
console.log(router.stack.map(i => i.path));

export default app;
