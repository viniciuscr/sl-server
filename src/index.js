
import app from "./server"
import { MongoClient } from "mongodb"


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

/* 
MongoClient.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, poolSize: 50, wtimeout: 2500 }
)
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await Photographer.injectDB(client)

    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })
 */