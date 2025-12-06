//require("dotenv").config(path: "./.env"); // COMMON JS SYNTAX but require and import cannot be used together
import dotenv from "dotenv";
import connectDB from "./db/db.js";

dotenv.config({
    path: "./.env"
});

// II APPROACH

connectDB()














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