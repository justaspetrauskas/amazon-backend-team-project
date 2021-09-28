import express from "express";
import cors from "cors";
import { createTables } from "../utils/create-tables.js";
import productsRouter from "./services/products/index.js";
import { publicFolderPath } from "../utils/utils.js";
import listEndpoints from "express-list-endpoints";
import reviewRouter from "./services/reviews/index.js";

const server = express();

const PORT = process.env.PORT;
const whitelist = [process.env.FE_DEV_URL, "https://anotherwebsite.com"];

const corsOpts = {
  origin: function (origin, next) {
    if (whitelist.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error("Origins is not allowed"));
    }
  },
};

server.use(cors());

server.use(express.json());
server.use(express.static(publicFolderPath));

// server.use("/products", productsRouter);
server.use("/reviews", reviewRouter);

console.table(listEndpoints(server));

server.listen(PORT, async () => {
  console.log("The server running on port:", PORT);
  await createTables();
});

server.on("error", (error) =>
  console.log(`Server is not running due to: ${error}`)
);
