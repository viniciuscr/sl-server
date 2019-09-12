import bcrypt from "bcryptjs";
let users;
export default class UserDao {


  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.DATA_BASE).collection("photographers");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static addUser(user) {
    return !user;
  }

  static getUser(email) {
    const pass = bcrypt.hashSync("pass", 10);
    return { name: "abacate", email, password: pass, role: "photographer", preferences: {} };

  }
  static async loginUser() {
    return { success: true };
  }
  static logoutUser() {
    return {};
  }

  static deleteUser() {
    return "userdeleted!";
  }
  static updatePreferences() {
    return {};
  }
}
