import { generateToken } from "../utils/generateToken";
import {Request,Response} from "express";
import User from "../models/userModel";

//login user
export const loginUser = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    let user = await User.login(email, password);

    const refreshToken = generateToken({_id:user._id,role:user.role},"60m");
    const accessToken = generateToken({_id:user._id,role:user.role},"15m");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 3600000,
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 3600000,
      secure: true,
    });

    user.refresh_token = refreshToken;
    await user.save();

    user.refresh_token = "******";
    user.password = "******";
    res.status(200).json(user);

  } catch (error:any) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
};

//signup user
export const signUser = async (req:Request, res:Response) => {
    const { email, password, name,role } = req.body;
    try {
      if (!name) {
        throw Error("Name is required");
      }
      let user = await User.signup(email, password, name,role);
  
      const refreshToken = generateToken({_id:user._id,role:user.role},"60m");
      const accessToken = generateToken({_id:user._id,role:user.role},"15m");
  
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 3600000,
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 3600000,
        secure: true,
      });
      user.refresh_token = refreshToken;
      await user.save();
  
      user.password = "******";
      user.refresh_token = "******";
      res.status(200).json(user);
    } catch (error:any) {
      console.log(error);
      res.status(400).json({error: error.message});
    }
  };