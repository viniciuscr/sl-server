const Koa = require("koa");
const Router = require("koa-router");
const Logger = require("koa-logger");
const Cors = require("@koa/cors");
const BodyParser = require("koa-bodyparser");
const Helmet = require("koa-helmet");
const respond = require("koa-respond");
const jwt = require("koa-jwt");
const app = new Koa();
const router = new Router();

const onceToken = require("./middleware/onceToken");

//set extra security headers
app.use(Helmet());
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(Logger());
}

app.use(jwt({ secret: process.env.SECRET }).unless({ path: [/^\/v[\d]{1,2}\/login/] }));

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


//Adds useful methods to Koa context.
app.use(respond());

// API routes
require("./routes").default(router);
app.use(router.routes());
app.use(router.allowedMethods());

app.use(onceToken());
module.exports = app;
