import mongoose from "mongoose";

const activities = ["publication","event","seminar","project","lecture","other"];

const ActivitySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    resource:{
        type:[{type:String}],
        required:true
    }
})

export const ResourceSchema = new mongoose.Schema({
    fid:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        unique:true
    },
    activityType:{
        type: String,
        enum: activities,
        required:true,
        default:"other"
    },
    activityDetails:{
        type:ActivitySchema,
        required:true
    },
    uploadedAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date
    }
})

export default mongoose.model("resources", ResourceSchema) ;