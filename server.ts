import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import dbconfig from "./utils/dbconfig";
import cookieParser from "cookie-parser";
import facultyController from "./api/controllers/faculty.controller";
import adminController from "./api/controllers/admin.controller";
import facultyResourceController from "./api/controllers/resources/faculty.controller";

dotenv.config({});
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser(process.env.SECRET_KEY));
dbconfig();

app.use('/api/faculty/auth',facultyController);
app.use('/api/admin/auth',adminController);
app.use('/api/faculty/resources',facultyResourceController);

app.listen(port,()=>{
    console.log(`App is running on port : ${port}`);
})