import express from "express"
import cors from "cors"
import productsRouter from "./products/index.js"

const server = express()

const port = 3001

server.use(cors())

server.use(express.json)

server.use("/products", productsRouter)
server.listen(port, () => console.log("The server running on port :", port))

server.on("error", (error) =>
    console.log(`Server is not running due to: ${error}`)
)