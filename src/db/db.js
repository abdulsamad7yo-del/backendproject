import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async()=>{
    try { 
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB connected successfully",connectionInstance.connection.host);
        
    } catch (error) {
        console.error("MONOGODB Connection ERROR",error);
        process.exit(1); // Exit process with failure 
        
    }
}

export default connectDB;