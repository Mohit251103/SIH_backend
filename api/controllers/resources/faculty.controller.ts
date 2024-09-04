import facultyResourceModel from "../../models/resources/faculty.model";
import express from "express";
import { ResourceSchema } from "../../models/resources/resource.model";
import resourceModel from "../../models/resources/resource.model";
import mongoose, { ObjectId } from "mongoose";

const router = express.Router();

interface ResourceSubdoc {
    url: string;
    uploadedAt: Date;
}

router.get(("/"), async (req, res) => {
    try {
        const data = req.body;
        const resource = await facultyResourceModel.findOne({ fid: data.fid });

        if (!resource) {
            return res.status(404).send("No resources found");
        }

        return res.status(200).json({ resources: resource.resources });
    } catch (error) {
        throw new Error(error as string);
    }
})

router.post(("/"), async (req, res) => {
    try {
        const data = req.body;

        const resource = await facultyResourceModel.findOne({ fid: data.fid });
        const resource_instance = await resourceModel.create({ url: data.url });
        if (resource) {
            resource.resources.push(resource_instance);
            await facultyResourceModel.updateOne({ resources: resource.resources });
            return res.status(200).send("Resource added successfully");
        }

        const faculty_resource_instance = {
            fid: data.fid,
            resources: [resource_instance]
        }

        await facultyResourceModel.create(faculty_resource_instance);
        return res.status(200).send("Resource added successfully");

    } catch (error) {
        throw new Error(error as string);
    }
})

router.delete("/", async (req, res) => {
    try {
        const data = req.body;
        const resource = await facultyResourceModel.findOne({ fid: data.fid });

        if (!resource) {
            return res.status(404).send("No resources found");
        }

        const modified_resources = resource.resources.filter((r)=>{
            return !r._id.equals(data.rid);
        }) as unknown as mongoose.Types.DocumentArray<mongoose.Types.Subdocument & ResourceSubdoc>;

        resource.resources = modified_resources;
        await resourceModel.deleteOne({_id: data.rid});


        await resource.save();
        return res.status(200).send("Resource deleted successfully");

    } catch (error) {
        throw new Error(error as string);
    }
})

export default router;