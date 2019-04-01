import app from "./server";
import { MongoClient } from "mongodb";
import UserDao from "./model/user.dao";
import ClientDao from "./model/client.dao";
import EventDao from "./model/event.dao";

const port = process.env.PORT || 3000;

MongoClient.connect(process.env.DB_URI, { useNewUrlParser: true, poolSize: 50, wtimeout: 9500 })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async client => {
    await UserDao.injectDB(client);
    await ClientDao.injectDB(client);
    await EventDao.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
