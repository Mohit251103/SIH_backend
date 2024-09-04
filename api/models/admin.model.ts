import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    instituteId:{
        type:String,
        required:true
    },
    isverified:{
        type:Boolean,
        default:false
    }
})

export default mongoose.model('admin', AdminSchema);