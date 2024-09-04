import Admin from "../models/admin.model";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otp from "../../utils/otpGenerator";
import sendmail from "../../utils/sendEmail";
import resendOtpController from "../controllers/extra/resend-otp.controller";

const router = express.Router();

router.post('/register', async (req,res)=>{
    try {
        const user:any = req.body;

        const admin = await Admin.findOne({email:user.email});
        if(admin){
            return res.status(409).send("User already exist");
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await Admin.create(user);

        const gen_otp = otp()
        res.cookie("otp",gen_otp,{maxAge:5*60*1000, secure:false, httpOnly:true});
        sendmail(user.email, gen_otp);

        res.status(200).send("Verification code sent");
        
    } catch (error:any) {
        throw new Error(`Internal server error : ${error}`);
    }
})

router.post('/verify-otp', async (req,res) => {
    try {
        const {otp,email} = req.body;
        const gen_otp = req.cookies.otp;
        if(!gen_otp){
            return res.status(408).send("Time out. Generate new OTP. ");
        }

        if(otp != gen_otp){
            return res.status(400).send("Wrong OTP");
        }

        const user = await Admin.findOne({email});
        if(!user){
            res.status(404).send("User does not exist");
        }

        user!.isverified = true;
        await user!.save();
        return res.status(200).send("User verified successfully.");
    } catch (error) {
        throw new Error(error as string);
    }
})

router.get('/login', async (req,res)=>{
    try {
        const user = req.body;
        const admin = await Admin.findOne({email:user.email});
        if(!admin){
            return res.status(404).send("User does not exist");
        }

        const comparePass = await bcrypt.compare(user.password, admin.password);
        if(!comparePass){
            return res.status(403).send("Incorrect credentials");
        }

        const token = jwt.sign({id:admin._id, email:admin.email}, process.env.SECRET_KEY as string);
        res.cookie("token",token,{
            maxAge:24*60*60*1000,
            secure:false,
            httpOnly:true
        })
        res.status(200).send("Logged in successfully");

    } catch (error) {
        throw new Error(`Internal server error : ${error}`);
    }
})

router.get("/logout", (req,res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).send("logged out successfully");
    } catch (error) {
        throw new Error(error as string);
    }
    
})

router.use('/resend-otp',resendOtpController);

router.get("/verify", async (req,res)=>{
    try {
        const {email} = req.body;
        const user = await Admin.findOne({email});
        if(!user){
            res.status(404).send("User does not exist");
        }

        res.status(200).send("User exist");
    } catch (error) {
        throw new Error(error as string);
    }
})

router.get("/reset-password", async (req,res)=>{
    try {
        const {email, password} = req.body;
        const user = await Admin.findOne({email});
        const hashedPassword = await bcrypt.hash(password, 10);
        user!.password = hashedPassword;

        await user!.save();
        return res.status(200).send("Password reset successfully");
    } catch (error) {
        throw new Error(error as string);
    }
})


export default router;