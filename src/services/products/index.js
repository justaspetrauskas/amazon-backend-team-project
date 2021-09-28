import express from "express";
import uniqid from "uniqid";
import { pool } from "../../../utils/create-tables.js";
import createHttpError from "http-errors";
import {
  imageUpload,
  getProducts,
  writeProducts,
  getReviews,
  dataFolderPath,
} from "../../../utils/utils.js";

const productsRouter = express.Router();
console.log("13" + dataFolderPath);

//to get the products
productsRouter.get("/", async (req, res, next) => {
  try {
    const query = `SELECT * FROM products;`;
    const result = await pool.query(query);
    res.send(result.rows);
  } catch (error) {
    next(createHttpError(400, { message: error.message }));
  }
});

// to get a product and a list of all the reviews of a specificproduct
productsRouter.get("/:id/", async (req, res, next) => {
  try {
    const query = `SELECT * FROM products WHERE product_id=${req.params.id}`;
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      const product = result.rows[0];
      const reviewQuery = `SELECT * FROM reviews WHERE product=${req.params.id};`;
      const reviewResult = await pool.query(reviewQuery);
      const reviews = reviewResult.rows;
      res.send({ author, books });
    } else {
      res
        .status(404)
        .send({ message: `Product with ${req.params.id} is not found.` });
    }
  } catch (err) {
    next(createHttpError(400, { message: err.message }));
  }
});
// to get all the producst based on category
productsRouter.get("/", async (req, res, next) => {
  try {
    res.send();
  } catch (err) {
    next(createHttpError(400, { message: error.message }));
  }
});

//to post a product
productsRouter.post(
  "/",
  imageUpload.single("image"),
  async (req, res, next) => {
    try {
      const { name, description, brand, price, category } = await req.body;
      const { image_URL } = req.file.path;
      console.log("image path" + req.file.path);
      const query = `
INSERT INTO 
products(
  name,description,brand,price,image_URL,category
)
VALUES(
   ${"'" + name + "'"},
   ${"'" + description + "'"},
   ${"'" + brand + "'"},
   ${"'" + price + "'"},
   ${"'" + image_URL + "'"},
   ${"'" + category + "'"}
   ) RETURNING *;`;

      const result = await pool.query(query);
      res.status(200).send(result.rows[0]);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
);
//to post a picture
// productsRouter.post(
//   "/:id/upload",
//   imageUpload.single("image"),
//   async (req, res, next) => {
//     try {
//       const products = await getProducts();
//       const product = products.find((product) => product.id === req.params.id);
//       if (!product) {
//         next(createHttpError(400, { message: error.message }));
//       } else {
//         product["imageURL"] = req.file.path;
//         // products.push(product);
//         await writeProducts(products);

//         res.status(201).send(result.rows[0]);
//       }
//     } catch (err) {
//       next(createHttpError(400, { message: error.message }));
//     }
//   }
// );

// to update the product
productsRouter.put("/:id", async (req, res, next) => {
  try {
    const { name, description, brand, price } = req.body;
    const { image_URL } = req.file.path;

    const query = `
    UPDATE products SET
    name=${"'" + name + "'"},
    description=${"'" + description + "'"},
    brand=${"'" + brand + "'"},
    price=${"'" + price + "'"},
    image_URL=${"'" + image_URL + "'"},
    updated_at= NOW()
    WHERE product_id=${req.params.id}
            RETURNING*;
    `;
    const result = await pool.query(query);
    res.send(result.rows[0]);
  } catch (error) {
    next(createHttpError(400, { message: error.message }));
  }
});

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const query = `DELETE FROM products WHERE product_id=${req.params.id}`;
    await pool.query(query);
    res.status(204).send();
  } catch (error) {
    next(createHttpError(400, { message: error.message }));
  }
});

export default productsRouter;
