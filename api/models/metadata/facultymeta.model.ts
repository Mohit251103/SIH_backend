import mongoose from "mongoose";

const ExperienceSchema  = new mongoose.Schema({
    role:String,
    org:String,
    description:String,
    start:String,
    end:String
})

const MetaDataSchema = new mongoose.Schema({
    fid:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    department:{
        type:String,
        required:true
    },
    experiences:{
        type:ExperienceSchema
    }
})

export default mongoose.model("facultymeta", MetaDataSchema);