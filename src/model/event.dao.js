import { ObjectId } from "bson";
/**
 *  @typedef {import('mongodb').Collection} Collection
 *  @type {Collection} */
let events;
export default class EventDao {

  /**
   * @typedef {import('mongodb').MongoClient} MongoClient 
   * @param {MongoClient} conn 
   */
  static async injectDB(conn) {
    if (events) {
      return;
    }
    try {
      events = conn.db(process.env.DATA_BASE).collection("photographers");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }


  static async saveEvent() {

  }
  static async getEvent({ eventCode, user }) {

    return await events.find({},

      {
        "events": {
          "$elemMatch": {
            "_id": ObjectId(eventCode)
          }
        },
        "events.clients": {
          "$elemMatch": {
            "_id": ObjectId(user.code)
          }
        }
      }
    );
  }

  static async updateEvent(event, email) {
    //use mongo to merge photos´ array

    //{ $setDifference: [ "photos", event.photos.toAdd ] }
    //{ $setUnion: [ "photos", event.photos.toDelete] }
  }
}