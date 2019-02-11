/**
 * @param{ import("koa-router")} router
 */
module.exports = router => {
  router
    .prefix("/v1")
    .use("/login", require("./login"))
    .use("/photographer", require("./photographer"));
};
