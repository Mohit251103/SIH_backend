import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import dbconfig from "./utils/dbconfig";
import cookieParser from "cookie-parser";
import facultyController from "./api/controllers/faculty.controller";
import adminController from "./api/controllers/admin.controller";
import facultyResourceController from "./api/controllers/resources/faculty.controller";
import metaController from "./api/controllers/meta/faculty.meta.controller";
import verifyToken from "./api/middlewares/verifyToken";
import { CustomReq } from "./custom/types/request";

dotenv.config({});
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin:"http://localhost:5174",
    credentials:true
}));
app.use(cookieParser(process.env.SECRET_KEY));
dbconfig();

app.use('/api/faculty/auth',facultyController);
app.use('/api/admin/auth',adminController);
app.use('/api/faculty/resources',facultyResourceController);
app.use('/api/faculty/meta', metaController);
app.get("/decode-token",verifyToken, (req,res)=>{
    return res.send(200).json({fid : (req as CustomReq).fid, email: (req as CustomReq).email});
})

app.listen(port,()=>{
    console.log(`App is running on port : ${port}`);
})