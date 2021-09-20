import express from "express"

import cors from "cors"
import productsRouter from "./products/index.js"

const server = express();

const PORT = 3003;

server.use(cors());

server.use(express.json());

server.use("/products", productsRouter);
server.listen(PORT, () => console.log("The server running on port"));

server.on("error", (error) =>
    console.log(`Server is not running due to: ${error}`)
);
