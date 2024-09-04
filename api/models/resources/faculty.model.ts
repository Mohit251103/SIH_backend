import mongoose from "mongoose";
import {ResourceSchema} from "./resource.model";

const date = new Date(Date.now());
const d = date.getDate();
const m = date.getMonth();
const y = date.getFullYear();

const FacultyResourceSchema = new mongoose.Schema({
    //faculty id
    fid:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        unique:true
    },
    resources:{
        type:[ResourceSchema]
    },
    createdAt:{
        type:String,
        default: `${d}-${m}-${y}`
    }
})

export default mongoose.model("facultyresources",FacultyResourceSchema);