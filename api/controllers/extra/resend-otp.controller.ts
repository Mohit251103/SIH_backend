import express from "express";
import otp from "../../../utils/otpGenerator";
import sendmail from "../../../utils/sendEmail";

const router = express.Router();

router.get('/', async (req,res)=>{
    try {
        const {email} = req.body;
        const gen_otp = otp();
        sendmail(email as string, gen_otp as string);
        return res.status(200).send("Otp sent successfully");
    } catch (error) {
        throw new Error(error as string);
    }
})

export default router;