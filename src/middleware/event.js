import EventDao from "../model/event.dao";
import fs from "fs";
import shortid from "shortid";
const roles = ["p", "a"];

export default class Event {
  static async createEvent(ctx) {
    try {
      const { event } = ctx.request.body;
      const { user } = ctx.state;

      if (!Array.includes(roles, user.role)) {
        ctx.unauthorized("User does not have permissions for it.");
        return;
      }
      if (!event.name || typeof event.name !== "string") {
        ctx.badRequest({ error: "Bad event format, expected name." });
        return;
      }

      if (!event.clients || event.clients.length <= 1) {
        ctx.badRequest({ error: "Bad event format, expected a clients list." });
        return;
      }
      if (!event.photos || event.photos.lenght < 1) {
        ctx.badRequest({ error: "Bad event format, expected a client list." });
        return;
      }
      event.status = "pending upload";
      event.hash = shortid.generate(); //hash to create a dir and save files
      await EventDao.saveEvent(event, user);

      ctx.ok({ message: `Event ${event.name} created`, event: event });
    } catch (e) {
      ctx.badRequest({ error: { message: e.message } });
      return;
    }
  }

  static async uploadPhoto(ctx) {
    const { user } = ctx.state;
    const { eventHash } = ctx.request.body;
    const photo = ctx.request.files[0];

    if (!Array.includes(roles, user.role)) {
      ctx.unauthorized("User does not have permissions for it.");
      return;
    }

    if (!eventHash) {
      ctx.badRequest({ error: "Bad event format, expected a eventHash." });
      return;
    }

    if (!photo) {
      ctx.badRequest({ error: "Bad event format, expected a photo to save." });
      return;
    }

    const userSlug = user.email.substr(0, user.email.indexOf("@") + 1);
    const eventFolder = `./${userSlug}${eventHash}`;

    !fs.existsSync(eventFolder) && fs.mkdirSync(eventFolder);

    const status = fs.existsSync(`${eventFolder}/${photo.filename}`) ? "replaced" : "created";

    fs.renameSync(photo.path, `${eventFolder}/${photo.filename}`);

    ctx.ok({ message: "Upload complete!", status, photo: photo.filename });
  }

  static getEvent() {}
}
