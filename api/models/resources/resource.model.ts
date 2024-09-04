import mongoose from "mongoose";

export const ResourceSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    uploadedAt:{
        type:Date,
        default:Date.now()
    }
})

export default mongoose.model("resources", ResourceSchema) ;