import express from "express";
import facultymetaModel from "../../models/metadata/facultymeta.model";
import facultyModel from "../../models/faculty.model";
const router = express.Router();

interface params{
    fid:string
}

router.post("/", async (req,res)=>{
    try {
        const {fid, name, email, department, institute, experiences} = req.body;
        const data_instance = new facultymetaModel({fid,name, email, department, institute, experiences});
        return res.status(200).send("added successfully");
    } catch (error) {
        throw new Error(error as string);
    }
})

router.get("/",async (req,res)=>{
    try {
        const {fid} = req.params as params;
        const data = await facultyModel.findById(fid);
        return res.status(200).json({data});
    } catch (error) {
        throw new Error(error as string);
    }
})

export default router;