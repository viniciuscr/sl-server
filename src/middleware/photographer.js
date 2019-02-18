import bcrypt from "bcrypt";
import UsersDAO from "../model/user.dao";
import User from "../model/user";
const hashPassword = async password => await bcrypt.hash(password, 10);

export default class Photographer {
  static async register(req, res) {
    try {
      const userFromBody = req.body;
      let errors = {};
      if (userFromBody && userFromBody.password.length < 8) {
        errors.password = "Your password must be at least 8 characters.";
      }
      if (userFromBody && userFromBody.name.length < 3) {
        errors.name = "You must specify a name of at least 3 characters.";
      }

      if (Object.keys(errors).length > 0) {
        this.badRequest(errors);
        return;
      }

      const userInfo = {
        ...userFromBody,
        password: await hashPassword(userFromBody.password)
      };

      const insertResult = await UsersDAO.addUser(userInfo);
      if (!insertResult.success) {
        errors.email = insertResult.error;
      }
      const userFromDB = await UsersDAO.getUser(userFromBody.email);
      if (!userFromDB) {
        errors.general = "Internal error, please try again later";
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const user = new User(userFromDB);

      this.ok({
        auth_token: user.encoded(),
        info: user.toJson()
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  static async login(ctx) {
    try {
      const { email, password } = ctx.body;
      if (!email || typeof email !== "string") {
        ctx.badRequest({ error: "Bad email format, expected string." });
        return;
      }
      if (!password || typeof password !== "string") {
        ctx.badRequest({ error: "Bad password format, expected string." });
        return;
      }
      let userData = await UsersDAO.getUser(email);
      if (!userData) {
        ctx.unauthorized({ error: "Make sure your email is correct." });
        return;
      }
      const user = new User(userData);

      if (!(await user.comparePassword(password))) {
        ctx.unauthorized({ error: "Make sure your password is correct." });
        return;
      }

      const loginResponse = await UsersDAO.loginUser(user.email, user.encoded());
      if (!loginResponse.success) {
        ctx.unauthorized({ error: loginResponse.error });
        return;
      }
      ctx.ok({ auth_token: user.encoded(), info: user.toJson() });
    } catch (e) {
      ctx.badRequest({ error: e });
      return;
    }
  }

  static async logout(ctx) {
    try {
      const userJwt = ctx.get("Authorization").slice("Bearer ".length);
      const userObj = await User.decoded(userJwt);

      if (userObj.error) {
        ctx.unauthorized.json({ error: userObj.error });
        return;
      }
      const logoutResult = await UsersDAO.logoutUser(userObj.email);

      if (logoutResult.error) {
        ctx.internalServerError({ error: logoutResult.error });
        return;
      }
      ctx.ok(logoutResult);
    } catch (e) {
      ctx.internalServerError.json(e);
    }
  }

  static async delete(ctx) {
    try {
      let { password } = ctx.body;
      if (!password || typeof password !== "string") {
        ctx.badRequest({ error: "Bad password format, expected string." });
        return;
      }
      const userJwt = ctx.get("Authorization").slice("Bearer ".length);
      const userClaim = await User.decoded(userJwt);
      if (userClaim.error) {
        ctx.badRequest({ error:userClaim.error });
        return;
      }
      const user = new User(await UsersDAO.getUser(userClaim.email));
      if (!(await user.comparePassword(password))) {
        ctx.badRequest({ error: "Make sure your password is correct." });
        return;
      }
      const deleteResult = await UsersDAO.deleteUser(userClaim.email);
      if (deleteResult.error) {
        ctx.internalServerError({ error: deleteResult.error });
        return;
      }
      ctx.ok(deleteResult);
    } catch (e) {
        ctx.internalServerError(e);
    }
  }

  static async save(ctx) {
    try {
      const userJwt = ctx.get("Authorization").slice("Bearer ".length);
      const userFromHeader = await User.decoded(userJwt);
      var { error } = userFromHeader;
      if (error) {
        ctx.unauthorized({ error });
        return;
      }

      await UsersDAO.updatePreferences(userFromHeader.email, ctx.body.preferences);
      const userFromDB = await UsersDAO.getUser(userFromHeader.email);
      const updatedUser = new User(userFromDB);

      ctx.ok({
        auth_token: updatedUser.encoded(),
        info: updatedUser.toJson()
      });
    } catch (e) {
      ctx.internalServerError(e);
    }
  }

  // for internal use only
  static async createAdminUser(req, res) {
    try {
      const userFromBody = req.body;
      let errors = {};
      if (userFromBody && userFromBody.password.length < 8) {
        errors.password = "Your password must be at least 8 characters.";
      }
      if (userFromBody && userFromBody.name.length < 3) {
        errors.name = "You must specify a name of at least 3 characters.";
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const userInfo = {
        ...userFromBody,
        password: await hashPassword(userFromBody.password)
      };

      const insertResult = await UsersDAO.addUser(userInfo);
      if (!insertResult.success) {
        errors.email = insertResult.error;
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const makeAdminResponse = await UsersDAO.makeAdmin(userFromBody.email);

      const userFromDB = await UsersDAO.getUser(userFromBody.email);
      if (!userFromDB) {
        errors.general = "Internal error, please try again later";
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
      }

      const user = new User(userFromDB);
      const jwt = user.encoded();
      const loginResponse = await UsersDAO.loginUser(user.email, jwt);

      res.json({
        auth_token: jwt,
        info: user.toJson()
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
