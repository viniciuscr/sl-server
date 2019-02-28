import Router from "koa-router";
import Middleware from "../middleware/event";
import busboy from 'koa-busboy';

const router = new Router();
router.post("/create", Middleware.createEvent);
router.post("/upload-photo", busboy(), Middleware.uploadPhoto);

export default router.routes();
