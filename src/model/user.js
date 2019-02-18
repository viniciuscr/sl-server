import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const roles = { g: "guest", a: "admin", p: "photographer", c: "cliente" };
export class User {
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
  async comparePassword(plainText) {
    return await bcrypt.compare(plainText, this.password);
  }
  encoded() {
    return jwt.sign(
      { 
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        ...this.toJson()
      },
      process.env.SECRET_KEY, {
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        algorithm: "HS384",
        
      }
    );
  }
  static async decoded(userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
      if (error) {
        return { error };
      }
      return new User(res);
    });
  }
}
