import mongoose from  "mongoose";
const conn = mongoose.connection;
import {ENV} from "./env.js";

export const connectDB = async() => {
    try{
        const { MONGO_URI} = ENV;
        if(!MONGO_URI) throw new Error("MONGO_URI is not set");
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    }catch(error){
        console.error("Error connecting to MONGODB:",error);
        process.exit(1);
        //1 sc is fail, 0 is succ
    }
}