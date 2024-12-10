import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import bodyParser from "body-parser"

import errorHandler from "./middlewares/errorHandler.middleware.js"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


// preparing server for receiving data from different source
// app.use() is used for doing configuration and setting middlewares.
app.use(express.json({ limit: "16kb" }))      // data recieving from form.
app.use(express.urlencoded({ extended: true, limit: "16kb" })) // data recieving from URL.
app.use(express.static("public")) // data recieving from file folder (stored in local).
app.use(cookieParser())           // data recieving from cookies or performing CRUD operation on cookie.
app.use(bodyParser.urlencoded({ extended: true }))


// importing routes
import productRouter from './routes/product.route.js'
import userRouter from './routes/user.route.js'
import orderRouter from './routes/order.route.js'

//defining routes
app.use("/api/v1/product", productRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/order", orderRouter)

//middleware for error
app.use(errorHandler)
export default app