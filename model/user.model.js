import mongoose from "mongoose";
export const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    }


})
export default mongoose.model.Users||mongoose.model('User',UserSchema);