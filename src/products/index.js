import express from "express"

import fs from "fs"

import uniqid from "uniqid"

import path, { dirname } from "path"

import { fileURLToPath } from "url"

const _filename = fileURLToPath(import.meta.url)

const _dirname = dirname(_filename)

const productsFilePath = path.join(_dirname, "products.json")