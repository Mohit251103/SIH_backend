import Admin from "../models/admin.model";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otp from "../../utils/otpGenerator";
import sendmail from "../../utils/sendEmail";

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
        const gen_otp = otp()
        const reg_token = jwt.sign(user, process.env.SECRET_KEY as string);
        res.cookie("otp",gen_otp,{maxAge:5*60*1000, secure:false, httpOnly:true});
        res.cookie("registerToken", reg_token, {maxAge:5*60*1000, secure:false, httpOnly:true});
        sendmail(user.email, gen_otp);

        res.status(200).send("Verification code sent");
        
    } catch (error:any) {
        throw new Error(`Internal server error : ${error}`);
    }
})

router.post('/verify', async (req,res) => {
    try {
        const {otp} = req.body;
        const gen_otp = req.cookies.otp;
        if(!gen_otp){
            return res.status(408).send("Time out. Generate new OTP. ");
        }

        const reg_token = req.cookies.registerToken;
        const user = jwt.verify(reg_token, process.env.SECRET_KEY as string);

        await Admin.create(user);
        return res.status(200).send("User registered successfully.");
    } catch (error) {
        throw new Error(error as string);
    }
})

router.post('/login', async (req,res)=>{
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

        const token = jwt.sign({id:admin._id}, process.env.SECRET_KEY as string);
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

export default router;