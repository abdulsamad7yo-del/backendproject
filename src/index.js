//require("dotenv").config(path: "./.env"); // COMMON JS SYNTAX but require and import cannot be used together
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import express from "express";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
});

// Second APPROACH


connectDB()
    .then(() => {
        // listen for requests only after successful connection to the database
        app.listen(process.env.PORT || 8000, () => {
            console.log("Server is running on port:", process.env.PORT);

        })
    })
    .catch((err) => {
        console.log("MONGODB connection Failed", err);

    })














/* FIRST APPROACH

import express from "express";

const app = express();

//IIFE
(async () => {
    try {

        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        
        app.on("error", (err) => {
            console.log("Error connecting to MongoDB", err);
            throw err;
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        }
        );

    } catch (error) {
        console.log("Error:", error);
        throw error;

    }
})()*/