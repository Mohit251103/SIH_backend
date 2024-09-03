import Faculty from "../models/faculty.model";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/register', async (req,res)=>{
    try {
        const user:any = req.body();

        const faculty = await Faculty.findOne({email:user.email});
        if(faculty){
            return res.status(409).send("User already exist");
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await Faculty.create(user);
        res.status(200).send("User created successfully");
        
    } catch (error:any) {
        throw new Error(`Internal server error : ${error}`);
    }
})

router.post('/login', async (req,res)=>{
    try {
        const user = req.body();
        const faculty = await Faculty.findOne({email:user.email});
        if(!faculty){
            return res.status(404).send("User does not exist");
        }

        const comparePass = await bcrypt.compare(user.password, faculty.password);
        if(!comparePass){
            return res.status(403).send("Incorrect credentials");
        }

        const token = jwt.sign({id:faculty._id}, process.env.SECRET_KEY);
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