import path from "path";
import fs from "fs-extra";
import uniqid from "uniqid";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const { readJSON, writeJSON } = fs;

export const publicFolderPath = path.join(process.cwd(), "public");
// set url storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "strive-marketplace",
  },
});

// set local storage for the files
const storage = multer.diskStorage({
  destination: publicFolderPath,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
  filename: function (req, file, cb) {
    cb(null, uniqid() + path.extname(file.originalname));
  },
});

export const imageUpload = multer({ storage: storage });
export const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data"
);
const productsJSONPath = join(dataFolderPath, "products.json");

const reviewsJSONPath = join(dataFolderPath, "reviews.json");

export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (content) => writeJSON(reviewsJSONPath, content);

export const writeProducts = (content) => writeJSON(productsJSONPath, content);
export const getProducts = () => readJSON(productsJSONPath);
