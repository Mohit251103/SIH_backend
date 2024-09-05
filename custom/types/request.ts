import { Request } from "express";

export interface CustomReq extends Request{
    fid:string;
    email:string
}
