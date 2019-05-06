db.createCollection("photographer", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password", "role"],
      properties: {
        name: {
          bsonType: "string",
          description: "User´s name"
        },
        email: {
          bsonType: "string",
          description: "User´s email"
        },
        password: {
          bsonType: "string",
          description: "A strong password is required"
        },
        subscription: {
          required: ["status", "due_day", "plan", "price"],
          bsonType: "object",
          properties: {
            status: {
              enum: ["active", "inactive", "suspended"],
              description: "Situation for the current subscription"
            },
            due_day: {
              bsonType: "int",
              minimum: 1,
              maximum: 31,
              exclusiveMaximum: false,
              description: "must be an integer in [ 1, 31 ] and is required"
            },
            plan: {
              bsonType: "string",
              description: "Must be a valid and active plan"
            },
            price: {
              bsonType: ["double"],
              description: "must be a double and is required"
            },
            history: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["status", "due_day", "plan", "price", "expiry"],
                properties: {
                  due_day: {
                    bsonType: "int",
                    minimum: 1,
                    maximum: 31,
                    exclusiveMaximum: false,
                    description:
                      "must be an integer in [ 1, 31 ] and is required"
                  },
                  plan: {
                    bsonType: "string",
                    description: "Must be a valid and active plan"
                  },
                  price: {
                    bsonType: ["double"],
                    description: "must be a double and is required"
                  },
                  status: {
                    enum: ["paid", "pending"],
                    description: "Situation for this payment"
                  },
                  expiry: {
                    bsonType: "date",
                    description: "date when subscriptions expires"
                  }
                }
              }
            }
          }
        },
        role: {
          enum: ["photographer", "client", "guest", "admin"],
          description: "Specifies the access´ level for each user"
        },
        events: {
          bsonType: "object",
          required: ["hash", "name", "sizes", "dates"],
          hash: { bsonType: "string", description: "hash" },
          name: { bsonType: "string", description: "event´s name" },
          sizes: {
            bsonType: "array",
            items: {
              bsonType: "string"
            }
          },
          photos: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["path", "name"],
              properties: {
                name: { bsonType: "string", description: "image´s name" },
                path: { bsonType: "string", description: "image´s location" }
              }
            }
          },
          dates: {
            bsonType: "object",
            required: ["start"],
            properties: {
              start: {
                bsonType: "date",
                description: "date when event is open"
              },
              end: {
                bsonType: "date",
                description: "date when event closes"
              }
            }
          },
          clients: {
            bsonType: "object",
            required: ["role", "status", "email", "password"],
            properties: {
              role: {
                enum: ["client", "guest"],
                description: "users´ privileges level"
              },
              email: { bsonType: "string", description: "users email " },
              password: { bsonType: "string", description: "users password " },
              status: {
                enum: ["open", "selecting", "finished"],
                description: "users´ privileges level"
              },
              selection: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["size", "name", "quantity"],
                  properties: {
                    name: {
                      bsonType: "string",
                      description: "image´s name"
                    },
                    size: {
                      bsonType: "string",
                      description: "image´s location"
                    },
                    quantity: {
                      bsonType: "int",
                      description: "image´s name"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});
