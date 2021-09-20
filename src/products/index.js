import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { imageUpload, getProducts, writeProducts } from "../../utils/utils.js";


const productsRouter = express.Router();



//to get the products
productsRouter.get("/", async (req, res, next) => {

  try {
    const products = await getProducts();

    res.status(200).send(products);
  } catch (error) {
    next(createHttpError(400, { message: error.message }));
  }
});


//to get a single product
productsRouter.get("/:id", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(productsFilePath);
        const fileAsString = fileAsBuffer.toString();
        fileAsJson = JSON.parse(fileAsString);
        const product = fileAsJson.find((product) => product.id === req.params.id);
        if (!product) {
            res
                .status(404)
                .send({ message: `Product with ${req.params.id} is not found` });
        }
        res.send(product);
    } catch (error) {
        res.send(500).send({ message: error.message });
    }
});

//to post a product

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = {
      id: uniqid(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const products = await getProducts();

    products.push(newProduct);
    await writeProducts(products);
    res.status(200).send({ newProduct });
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});
//to post a picture
productsRouter.post(
  "/:id/upload",
  imageUpload.single("image"),
  async (req, res, next) => {
    try {
      const products = await getProducts();
      const product = products.find((product) => product.id === req.params.id);
      if (!product) {
        next(createHttpError(400, { message: error.message }));
      } else {
        product["imageURL"] = req.file.path;
        // products.push(product);
        await writeProducts(products);

        res.status(200).send({ product });
      }
    } catch (err) {
      next(createHttpError(400, { message: error.message }));
    }
  }
);

// to update the product
productsRouter.put("/:id", async (req, res, next) => {
  try {
    const products = await getProducts();

    const productIndex = products.findIndex(
      (product) => product.id === req.params.id
    );
    if (!productIndex == -1) {
      res
        .status(404)
        .send({ message: `product with ${req.params.id} is not found` });
    }
    const previousProductData = products[productIndex];
    const changedProduct = {
      ...previousProductData,
      ...req.body,
      updatedAt: new Date(),
    };
    products[productIndex] = changedProduct;
    await writeProducts(products);
    res.send("updated");
  } catch (error) {
    next(createHttpError(400, { message: error.message }));
  }
});

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const products = await getProducts();

    const product = products.find((product) => product.id === req.params.id);
    if (!product) {
      next(createHttpError(400, { message: error.message }));
    }
    const filtered = products.filter((product) => product.id !== req.params.id);
    await writeProducts(filtered);
    res.status(204).send();
  } catch (error) {
    next(createHttpError(400, { message: error.message }));
  }

});

export default productsRouter
