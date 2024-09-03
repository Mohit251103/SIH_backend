import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import dbconfig from "./utils/dbconfig";
import cookieParser from "cookie-parser";

dotenv.config({});
const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(cookieParser(process.env.SECRET_KEY, {maxAge:24*60*60*1000}));
dbconfig();

app.get('/',(req,res)=>{
    return res.send("Hello World");
})

app.listen(port,()=>{
    console.log(`App is running on port : ${port}`);
})