import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    instituteId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        requires: true
    },
    email: { 
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    instituteName:{
        type:String,
        required:true
    }
})

export default mongoose.model("Admin", AdminSchema);