import Router from "koa-router";
const router = new Router();
import Middleware from "../middleware/event";

router.get("/create", Middleware.createEvent)

export default router.routes();
