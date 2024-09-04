import express from "express";
import resourceModel from "../../models/resources/resource.model";

const router = express.Router();

interface ResourceSubdoc {
    url: string;
    uploadedAt: Date;
}


// fetch resources
router.get(("/"), async (req, res) => {
    try {
        const data = req.body;
        const user_resources = await resourceModel.find({ fid: data.fid });

        if (!user_resources) {
            return res.status(404).send("No resources found");
        }

        return res.status(200).json({ resources: user_resources });
    } catch (error) {
        throw new Error(error as string);
    }
})

// pass resources to database
router.post(("/"), async (req, res) => {
    try {
        const data = req.body;
        await resourceModel.create(data);
        return res.status(200).send("Resource added successfully");

    } catch (error) {
        throw new Error(error as string);
    }
})


// delete any particular resource
router.delete("/", async (req, res) => {
    try {
        const data = req.body;
        await resourceModel.deleteOne({fid:data.fid, _id:data.rid});
        return res.status(200).send("Resource deleted successfully");

    } catch (error) {
        throw new Error(error as string);
    }
})

export default router;