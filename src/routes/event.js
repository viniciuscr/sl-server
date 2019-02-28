import Router from "koa-router";
import Middleware from "../middleware/event";
import busboy from "koa-busboy";

const router = new Router();
router.post("/", Middleware.getEvent);
router.post("/create", Middleware.createEvent);
router.post(
  "/upload-photo",
  busboy({
    acceptedMimeTypes: ["image/gif", "image/jpeg", "image/png", "image/svg+xml", "image/x-icon"]
  }),
  Middleware.uploadPhoto
);

export default router.routes();
