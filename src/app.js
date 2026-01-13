import express from "express"
import cors from "cors"
import cookiesParser from "cookies-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
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

export { app }