import EventDao from "../model/event.dao";
import fs from "fs";
import shortid from "shortid";
import emailHelper from "../helper/email";

const roles = ["p", "a"];

export default class Event {
  static async createEvent(ctx) {
    const { event = {} } = ctx.request.body;
    const { user } = ctx.state;

    if (!Array.includes(roles, user.role)) {
      ctx.unauthorized("User does not have permissions for it.");
      return;
    }
    if (!event.name || typeof event.name !== "string") {
      ctx.badRequest({ error: "Bad event format, expected name." });
      return;
    }

    if (!(event.clients instanceof Array)) {
      ctx.badRequest({ error: "Bad event format, expected a client´s list." });
      return;
    }
    if (!(event.photos instanceof Array)) {
      ctx.badRequest({ error: "Bad event format, expected a photo´s list." });
      return;
    }

    event.clients = event.clients.map(email => ({
      email,
      password: shortid.generate()
    }));
    event.status = "pending upload";
    event.hash = shortid.generate(); //hash to create a dir to save files inside
    const userSlug = user.email.substr(0, user.email.indexOf("@") + 1);
    const eventFolder = `./static/${userSlug}${event.hash}`;

    event.photos = event.photos.map(photo => ({
      ...photo,
      path: `${eventFolder}/${photo.name}`
    }));

    const sendEmails = emailHelper.sendCreateEventEmails(event);
    const saveEvent = EventDao.saveEvent(event, user);

    const result = await Promise.all([sendEmails, saveEvent]);

    ctx.ok({ message: `Event ${event.name} created`, event: event, result });
  }

  static async updateEvent(ctx) {
    const { event = {} } = ctx.request.body;
    const { user } = ctx.state;

    if (!event.code) {
      ctx.badRequest({ error: "Bad event format, expected a event code." });
    }

    const updateResult = await EventDao.updateEvent(event, user.email);

    return ctx.ok(updateResult);
  }

  static async uploadPhoto(ctx) {
    const { user } = ctx.state;
    const { eventHash, uploadError } = ctx.request.body;
    const photo = ctx.request.files[0];

    if (uploadError) {
      ctx.badRequest({ error: uploadError });
      return;
    }

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
    const eventFolder = `./static/${userSlug}${eventHash}`;

    !fs.existsSync(eventFolder) && fs.mkdirSync(eventFolder);

    const status = fs.existsSync(`${eventFolder}/${photo.filename}`)
      ? "replaced"
      : "created";

    fs.renameSync(photo.path, `${eventFolder}/${photo.filename}`);

    ctx.ok({ message: "Upload complete!", status, photo: photo.filename });
  }

  static async getEvent(ctx) {
    const { event = {} } = ctx.request.body;
    const { user } = ctx.state;

    if (!event.code) {
      ctx.badRequest({ error: "Bad event format, expected a event code." });
      return;
    }

    const eventStored = await EventDao.getEvent({
      eventCode: event.code,
      user: user
    });
    if (!eventStored) {
      ctx.notFound({ message: "Event does not exists" });
      return;
    }

    ctx.ok({ event: eventStored });
  }
}
