import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export class User {
  constructor({ name, email, password, preferences = {} } = {}) {
    this.name = name
    this.email = email
    this.password = password
    this.preferences = preferences
  }
  toJson() {
    return { name: this.name, email: this.email, preferences: this.preferences }
  }
  async comparePassword(plainText) {
    return await bcrypt.compare(plainText, this.password)
  }
  encoded() {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        ...this.toJson(),
      },
      process.env.SECRET_KEY,
    )
  }
  static async decoded(userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
      if (error) {
        return { error }
      }
      return new User(res)
    })
  }
}