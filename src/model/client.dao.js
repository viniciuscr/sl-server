import { ObjectId } from "bson"

let clients

export default class ClientDao {
  static async injectDB(conn) {
    if (clients) {
      return;
    }
    try {
      clients = await conn.db(process.env.DATA_BASE).collection("clients");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async getEvent({ eventCode, clientEmail, photographer }) {
    return {
      _id: eventCode,
      name: "nome do evento",
      status: "open",
      photos: [
        {
          _id: "jfh37HSud7h3",
          src: "/static/abacate@jjfhd/img001.jpeg"
        },
        {
          _id: "88u8u7GHSud7h3",
          src: "/static/abacate@jjfhd/img001.jpeg"
        },
        {
          _id: "sdfju345ny",
          src: "/static/abacate@jjfhd/img001.jpeg"
        }
      ],
      selection: {
        status: "selecting",
        photos: [
          {
            photo_id: "jfh37HSud7h3",
            size: "13x18",
            quantity: 1
          },
          {
            photo_id: "jfh37HSud7h3",
            size: "10x15",
            quantity: 3
          },
          {
            photo_id: "88u8u7GHSud7h3",
            size: "13x18",
            quantity: 2
          }
        ]
      }
    };
  }

  static async getEventsList({ clientEmail, active = false }) {
    return [];
  }

  static async finishSelection() {}
}
