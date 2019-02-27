import Koa from "koa";
import Router from "koa-router";
import Logger from "koa-logger";
import Cors from "@koa/cors";
import BodyParser from "koa-bodyparser";
import Helmet from "koa-helmet";
import respond from "koa-respond";
import jwt from "koa-jwt";
const app = new Koa();
const router = new Router();

//set extra security headers
app.use(Helmet());

process.env.NODE_ENV === "development" && app.use(Logger());

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

app.use(jwt({ secret: process.env.SECRET_KEY }).unless({ path: [/^\/v[\d]{1,2}\/user\/login/] }));
//Adds useful methods to Koa context.
app.use(respond());

// API routes
require("./routes").default(router);
app.use(router.routes());
app.use(router.allowedMethods());

console.log(router.stack.map(i => i.path));

export default app;
