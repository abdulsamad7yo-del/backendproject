import express from "express"
import cors from "cors"
import cookiesParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: "*",
    credentials: true

}))

// size limit
app.use(express.json(
    {
        limit: "16kb"
    }
))

//accept the data from url like what will be ... abdul samad -> abdul%samad or abdul+samad any from will be accepted
app.use(express.urlencoded(
    {
        extended: true, 
        limit: "16kb"
    }
))
 
// use to store files on own server public assest example favicon
app.use(express.static("public"))

// help to perform crud operation on cookies
app.use(cookiesParser())

import userRouter from "./routes/user.routes.js"

// routes declaration

app.use("/api/v1/users",userRouter)

// http://localhost:4000/api/v1/users/register

export  { app }