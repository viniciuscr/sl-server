import EventDao from "../model/event.dao";
import Busboy from "busboy";
import path from "path";
import fs from "fs";
import os from "os";

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
      await EventDao.saveEvent(event, user);

      ctx.ok({ message: `Event ${event.name} created` });
    } catch (e) {
      ctx.badRequest({ error: { message: e.message } });
      return;
    }
  }

  static uploadPhoto(ctx) {
    const { user } = ctx.state;

    if (!Array.includes(roles, user.role)) {
      ctx.unauthorized("User does not have permissions for it.");
      return;
    }

    const busboy = new Busboy({ headers: ctx.request.headers });
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      var saveTo = path.join(os.tmpDir(), path.basename(fieldname));
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function () {
      ctx.ok({ message: "File Saved!" })
    });
    return ctx.request.pipe(busboy);
  }


  static getEvent() { }
}
