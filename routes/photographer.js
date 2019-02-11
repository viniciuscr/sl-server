const Router = require("koa-router");
const router = new Router();
const Middleware = require("../middleware/photographer");

router.get("/", Middleware.hello);

module.exports = router.routes();
