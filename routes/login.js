const Router = require("koa-router");
const router = new Router();
const Ctrl = require("../controller/login");

router.get("/", Ctrl.login);

module.exports = router.routes();
