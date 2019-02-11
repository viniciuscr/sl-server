const Router = require("koa-router");
const router = new Router();
const Ctrl = require("../controller/photographer");

router.get("/", Ctrl.hello);

module.exports = router.routes();
