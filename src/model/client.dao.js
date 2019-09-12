import { ObjectId } from "bson";
/**
 *  @typedef {import('mongodb').Collection} Collection
 *  @type {Collection} */
let clients;

export default class ClientDao {
  static async injectDB(conn) {
    if (clients) {
      return;
    }
    try {
      clients = await conn.db(process.env.DATA_BASE).collection("photographers");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async getEvent({ eventCode, clientEmail, photographer }) {
    return {
      _id: eventCode,
      name: "nome do evento",
      status: "open",
      sizes: ["10x15", "13x18", "15x21"],
      dates: {
        start: "2019-04-23T18:25:43.511Z",
        end: "2019-05-23T18:25:43.511Z"
      },
      photos: [
        {
          name: "img001",
          path: "/static/abacate@jjfhd/img001.jpeg"
        },
        {
          name: "img002",
          path: "/static/abacate@jjfhd/img002.jpeg"
        },
        {
          name: "img003",
          path: "/static/abacate@jjfhd/img003.jpeg"
        }
      ],
      selection: {
        status: "selecting",
        photos: [
          {
            photo: "img001.jpeg",
            size: "13x18",
            quantity: 2
          },
          {
            photo: "img001.jpeg",
            size: "15x21",
            quantity: 1
          },
          {
            photo: "img002.jpeg",
            size: "15x21",
            quantity: 3
          }
        ]
      }
    };
  }

  static async getEventsList({ clientEmail, active = false }) {
    return [];
  }

  static async find({ email, password }) {

    const client = await clients.findOne({
      "events.clients": {
        "$elemMatch": {
          "email": "clicli@mail.com",
          "password": "Jjfh4d4"
        }
      }
    })
    console.log(client)

  }

  static async finishSelection() { }
}
