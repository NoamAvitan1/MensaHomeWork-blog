import {Document} from "mongoose"

export interface BlogType extends Document{
    title:string;
    content:string;
    author:string;
}
