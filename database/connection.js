import mongoose from "mongoose";
import ENV from "../router/connfig.js"
// import { MongoMemoryServer } from "mongodb-memory-server";
async function connect(){
    // const mongod =await MongoMemoryServer.create();
    const getUri = mongod.getUri();
    mongoose.set('strictQuery',true)
    // const db = await mongoose.connect(getUri);
    
    const db = await mongoose.connect("mongodb+srv://manish9958:Manish@cluster0.pq1kopd.mongodb.net/?retryWrites=true&w=majority");
    console.log("DATABASE CONNECTED")
    return db;
}
export default connect;