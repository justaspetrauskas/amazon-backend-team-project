import fs from 'fs-extra'
import {join, dirname} from 'path'
import { fileURLToPath } from 'url'

const { readJSON, writeJSON} = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const reviewsJSONPath = join(dataFolderPath, "reviews.json")

export const getReviews = () => readJSON(reviewsJSONPath)
export const writeReviews = content => writeJSON(reviewsJSONPath, content)