import Router from "koa-router";
const router = new Router();
import Middleware from "../middleware/user";

router.post("/login", Middleware.login);
router.post("/register", Middleware.register);

export default router.routes();
