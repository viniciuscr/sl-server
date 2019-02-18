let users;
let sessions;

export default class UsersDAO {
  static async injectDB(conn) {
    if (users && sessions) {
      return;
    }
    try {
      users = await conn.db(process.env.NS).collection("users");
      sessions = await conn.db(process.env.NS).collection("sessions");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  /**
   * Finds a user in the `users` collection
   * @param {string} email - The email of the desired user
   * @returns {Object | null} Returns either a single user or nothing
   */
  static async getUser(email) {
    return await users.findOne({ email });
  }
  /**
   * Given a user's email and an object of new preferences, update that user's
   * data to include those preferences.
   * @param {string} email - The email of the user to update.
   * @param {Object} preferences - The preferences to include in the user's data.
   * @returns {DAOResponse}
   */
  static async updatePreferences(email, preferences) {
    try {
      preferences = preferences || {};

      const updateResponse = await users.updateOne({ email: email }, { $set: preferences });

      if (updateResponse.matchedCount === 0) {
        return { error: "No user found with that email" };
      }
      return updateResponse;
    } catch (e) {
      console.error(`An error occurred while updating this user's preferences, ${e}`);
      return { error: e };
    }
  }
}
