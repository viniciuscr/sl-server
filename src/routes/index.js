/**
 * @param{ import("koa-router")} router
 */
export default router => {
  router
    .prefix("/v1")
    .use("/user", require("./user").default)
    .use("/event", require("./event").default)
    .use("/client", require("./client").default)
};
