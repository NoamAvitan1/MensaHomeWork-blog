import {Request,Response} from "express";
import blogModel from "../models/blogModel";
import { isValidObjectId } from "mongoose";
import User from "../models/userModel";


export const createBlogs = async(req:Request, res:Response) => {
    try {   
        if (!isValidObjectId(req.body.author)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }
        // Check if the user with the provided author ID exists
        const existingUser = await User.findById(req.body.author);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const blog = new blogModel(req.body);
        await blog.save();
        return res.json(blog);
    } catch (error:any) {
        console.log(error);
        return res.status(502).json({error});
    }
}

export const deleteBlogs = async(req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const blog = await blogModel.findByIdAndDelete(id);
        if(!blog){
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error,location:"delete blog" });
    }
}

export const updateBlog = async(req:Request, res:Response) => {
    try {
        const {id} = req.params;
        const blog = await blogModel.findByIdAndUpdate(id,req.body)
        if(!blog){
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getBlog = async(req:Request, res:Response) => {
    try {
        const {id:_id} = req.params;
        const blog = await blogModel.findOne({_id})
        if(!blog){
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

