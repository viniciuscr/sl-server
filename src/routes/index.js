/**
 * @param{ import("koa-router")} router
 */
export default router => {
  router
    .prefix("/v1")
    .use("/user", require("./user").default)
};
