import express from 'express'
import cors from 'cors'
import listEndpoints from "express-list-endpoints"
import reviewRouter from "./services/reviews/index.js"

const server = express()
const port = 3001

//---Global Middlewares---

server.use(cors())    // Add this to make your FE be able to communicate with BE
server.use(express.json())    // If I do not specify this line BEFORE the routes, all the requests' bodies will be UNDEFINED



server.use("/reviews", reviewRouter)

console.table(listEndpoints(server))


server.listen(port, () => {
  console.log("SERVER RUNNING ON PORT", port)
})
