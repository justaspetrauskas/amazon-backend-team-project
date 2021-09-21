import express from "express";
import cors from "cors";
import productsRouter from "./services/products/index.js";
import { publicFolderPath } from "../utils/utils.js";
import listEndpoints from "express-list-endpoints";
import reviewRouter from "./services/reviews/index.js";

const server = express();

const PORT = process.env.PORT;
console.log(PORT);

server.use(cors());

server.use(express.json());
server.use(express.static(publicFolderPath));

server.use("/products", productsRouter);
server.use("/reviews", reviewRouter);

console.table(listEndpoints(server));

server.listen(PORT, () => console.log("The server running on port:", PORT));

server.on("error", (error) =>
  console.log(`Server is not running due to: ${error}`)
);
