import mongoose,{Schema} from "mongoose";
import { BlogType } from "../interfaces/blogType";

const blogSchema:Schema = new Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    content:{
        type:String,
        required:true,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
})

export default mongoose.model<BlogType>('Blog',blogSchema);
