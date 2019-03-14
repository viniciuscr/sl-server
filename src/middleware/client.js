import ClientDao from "../model/client.dao";
import shortid from "shortid";
import User from "../model/user";

const isEmailValid = email =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

export default class Client {
  static async getEvent(ctx) {
    const { event = {} } = ctx.request.body;
    const { user } = ctx.state;

    if (!event.code) {
      ctx.badRequest({ error: "Bad event format, expected a event code." });
    }

    const eventStored = await ClientDao.getEvent({
      eventCode: event.code,
      clientEmail: user.email,
      photographer: user.preferences.photographer
    });
    if (!eventStored) {
      ctx.notFound({ message: "Event does not exists" });
      return;
    }

    ctx.ok({ event: eventStored });
  }

  static async getActiveEventsList(ctx) {
    const { user } = ctx.state;

    const eventsList = await ClientDao.getEventsList({ clientEmail: user.email, active: true });

    ctx.ok({ eventsList });
    return;
  }

  static async saveSelection(ctx) {
    const { event = {} } = ctx.request.body;
    const { user } = ctx.state;

    if (!(event.selection instanceof Array)) {
      ctx.badRequest({ error: "Bad event format, expected a selections list." });
      return;
    }

    if (!event.code) {
      ctx.badRequest({ error: "Bad event format, expected a event code." });
    }

    const result = await ClientDao.saveSelection(event.code, event.selection, user.email);

    ctx.ok({ result });
  }

  static async login(ctx) {
    let errors = {};
    const { email, password } = ctx.request.body;

    if (!isEmailValid(email)) {
      errors.email = "Invalid e-mail.";
    }
    if (shortid.isValid(password)) {
      errors.password = "Invalid password.";
    }

    if (Object.keys(errors).length > 0) {
      this.badRequest(errors);
      return;
    }
    const client = new User(email, password, "c", {}); 

    ctx.ok({ client });
  }

  static async finishSelection(ctx) {
    const { event = {} } = ctx.request.body;
    const { user } = ctx.state;

    if (!event.code) {
      ctx.badRequest({ error: "Bad event format, expected a event code." });
    }
    const result = await ClientDao.finishSelection(event.code, user.email);

    if (result.error) {
      ctx.internalServerError({ error: result.error.message });
      return;
    }

    ctx.ok({ result });
  }
}
