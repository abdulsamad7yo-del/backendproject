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

// import routes
import userRouter from "./routes/user.routes.js"

import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

// Routes declaration

app.use("/api/v1/users",userRouter)

//todo
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:4000/api/v1/users/register

export  { app }