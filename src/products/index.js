import express from "express"

import fs from "fs"

import uniqid from "uniqid"

import path, { dirname } from "path"


import { fileURLToPath } from "url"

const _filename = fileURLToPath(import.meta.url)

const _dirname = dirname(_filename)

const productsFilePath = path.join(_dirname, "products.json")

const productsRouter = express.Router()

//to get the products

productsRouter.get("/", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(productsFilePath)
        const fileAsString = fileAsBuffer.toString()
        const fileAsJson = JSON.parse(fileAsString)
        response.send(fileAsJson)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})

//to get a single product
productsRouter.get("/:id", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(productsFilePath)
        const fileAsString = fileAsBuffer.toString()
        fileAsJson = JSON.parse(fileAsString)
        const product = fileAsJson.find((product) => product.id === req.params.id)
        if (!product) {
            res.status(404).send({ message: `Product with ${req.params.id} is not found` })
        }
        res.send(product)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})

//to post a product
productsRouter.post("/", async (req, res, next) => {
    try {
        const product = {
            id: uniqid(),
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const fileAsBuffer = fs.readFileSync(productsFilePath)
        const fileAsString = fileAsBuffer.toString()
        const fileAsJson = JSON.parse(fileAsString)
        fileAsJson.push(product)
        fs.writeFileSync(productsFilePath, JSON.stringify(fileAsJson))
        res.send(product)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})

// to update the product
productsRouter.put("/:id", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(productsFilePath)
        const fileAsString = fileAsBuffer.toString()
        const fileAsJson = JSON.parse(fileAsString)

        const productIndex = fileAsJson.findIndex(
            (product) => product.id === req.params.id
        )
        if (!productIndex == -1) {
            res.status(404).send({ message: `product with ${req.params.id} is not found` })
        }
        const previousProductData = fileAsJson[productIndex]
        const changedProduct = {
            ...previousProductData,
            ...req.body,
            updatedAt: new Date(),
            id: req.params.id
        }
        fileAsJson[productIndex] = changedProduct
        fs.writeFileSync(productsFilePath, JSON.stringify(fileAsJson))
        res.send(changedProduct)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})


productsRouter.delete("/:id", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(productsFilePath)
        const fileAsString = fileAsBuffer.toString()
        let fileAsJson = JSON.parse(fileAsString)

        const product = fileAsJson.find((product) => product.id === req.params.id)
        if (!product) {
            res.status(404).send({ message: `Product with ${req.params.id} is not found!` })
        }
        fileAsJson = fileAsJson.filter(
            (product) => product.id !== req.params.id
        )
        fs.writeFileSync(productsFilePath, JSON.stringify(fileAsJson))
        res.status(204).send()
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})

export default productsRouter