import mongoose from "mongoose";
export const db=()=>{

    mongoose
    .connect("mongodb+srv://manish9958:Manish@cluster0.pq1kopd.mongodb.net/?retryWrites=true&w=majority",{
        dbName:"profiles"
    })
    .then(()=>{console.log("Database connected")})
    
    .catch((e)=>{console.log(e)})
    


}
