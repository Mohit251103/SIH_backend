import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
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
    department:{
        type:String,
        required:true
    },
    isverified:{
        type:Boolean,
        default:false
    },
    isfirsttime:{
        type:Boolean,
        default:true
    }
})

export default mongoose.model('faculty', FacultySchema);