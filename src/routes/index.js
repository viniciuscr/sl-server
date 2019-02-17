/**
 * @param{ import("koa-router")} router
 */
export default router => {
  router
    .prefix("/v1")
    .use("/login", require("./login").default)
    .use("/photographer", require("./photographer"));
};
