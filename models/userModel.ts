import mongoose,{Schema,Model,Document} from "mongoose";
import bcrypt from 'bcrypt'
import validator from "validator";
import { UserType } from "../interfaces/userType";

interface UserDocument extends UserType, Document {
}

interface UserModel extends Model<UserDocument> {
  signup(email: string, password: string, name: string,role:'admin' | 'user'): Promise<UserDocument>;
  login(email: string, password: string): Promise<UserDocument>;
}

const userSchema:Schema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    name:{
      type:String,
      required:false,
    },
    refresh_token:{
        type:String,
        required:false,
    },
    role:{
        type:String,
        required:false,
        default:'user',
        enum:['user','admin']
    }
},{timestamps:true})

userSchema.statics.signup = async function (email:string,password:string,name:string,role:'admin' | 'user'):Promise<UserDocument>{
    //validation
    if(!email || !password){
        throw Error('All fields must be filled ')
    }
    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
         throw Error('Passowrd not strong enough');
    }
  const exists = await this.findOne({ email })
  if(exists){
    throw Error('Email already in use')
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user  = await this.create({email,password:hash,name,role})

  return user;
}

userSchema.statics.login = async function(email:string,password:string):Promise<UserDocument> {
    if(!email || !password){
        throw Error('All fields must be filled ')
    }
    
    const user = await this
      .findOne({ email });
    if(!user){
      throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password,user.password)
    if(!match){
      throw Error('Incorrect password');
    }
    return user;
}

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
export default User;