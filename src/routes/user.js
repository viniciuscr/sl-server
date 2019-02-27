import Router from "koa-router";
const router = new Router();
import Middleware from "../middleware/user";

router.get("/login", Middleware.login);

export default router.routes();
