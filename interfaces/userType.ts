import {Document} from "mongoose"

export interface UserType extends Document{
    email:string;
    password:string;
    name:string;
    refresh_token:string;
    role:'user' | 'admin';
}
