import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const roles = { guest: "g", admin: "a", photographer: "p", cliente: "c" };
export default class User {
  constructor({ name, email, password, role, preferences = {} } = {}) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.preferences = preferences;
  }
  toJson() {
    return {
      name: this.name,
      email: this.email,
      role: roles[this.role],
      preferences: this.preferences
    };
  }
  comparePassword(plainText) {
    return bcrypt.compareSync(plainText, this.password);
  }
  encoded() {
    return jwt.sign(
      this.toJson(),

      process.env.SECRET_KEY,
      {
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        algorithm: "HS384"
      }
    );
  }

  static async inpersonate(email) {}

  static async decoded(userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
      if (error) {
        return { error };
      }
      return new User(res);
    });
  }
}
