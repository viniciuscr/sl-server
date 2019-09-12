import Router from "koa-router";
const router = new Router();
import Middleware from "../middleware/client";

router.post("/event", Middleware.getEvent);
router.post("/login", Middleware.login);
router.post("/finish", Middleware.finishSelection);
router.post("/list-events", Middleware.getActiveEventsList);
router.post("/saveSelection", Middleware.saveSelection);
export default router.routes();
