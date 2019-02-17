import Router from "koa-router";
const router = new Router();
import { login } from "../middleware/login";

router.post("/", login);

export default router.routes();
