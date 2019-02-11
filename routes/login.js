const Router = require("koa-router");
const router = new Router();
const Middleware = require("../middleware/login");

router.post("/", Middleware.login);

module.exports = router.routes();
