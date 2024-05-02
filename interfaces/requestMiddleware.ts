import { Request } from "express";
export interface MyRequest extends Request {
    _id?: string; 
    role?: string;
}