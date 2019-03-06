import Router from "koa-router";
const router = new Router();
import Middleware from "../middleware/user";

router.post("/login", Middleware.login);

export default router.routes();
