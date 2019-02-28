import bcrypt from "bcryptjs";
export default class UserDao {
  static getUser(email) {
    const pass = bcrypt.hashSync("pass", 10);
   return  {name:"abacate", email, password: pass, role: "photographer", preferences:{}};
   
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
