import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { generateToken } from "../utils/generateToken";
import { VerifyToken } from "../interfaces/verifyToken";
import { MyRequest } from "../interfaces/requestMiddleware";
import { CustomRequest } from "../interfaces/customRequest";
import * as dotenv from "dotenv";
dotenv.config();

export const authentication = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  const errorObject = { message: "unauthorized" };
  console.log("arrivad to authenticate");
  try {
    // checking if the access token is valid
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!process.env.SECRET) {
      console.error("SECRET is not defined in the environment variables");
      throw new Error("SECRET is not defined") // Exit the process if SECRET is not defined
    }

    if (accessToken) {
      try {
        // checking that the access token is not expired
        const decodedToken = jwt.verify(accessToken, process.env.SECRET);
        if (typeof decodedToken === "string") {
          // If the decoded token is a string, it's an error message
          throw new Error(decodedToken);
        }
        const { _id, role } = decodedToken as VerifyToken;
        req._id = _id;
        req.role = role;
        return next();
      } catch {
        //if the access token expired, we need to continue and check if the refresh token is valid
      }
    } else {
      throw { ...errorObject, type: "accessToken" };
    }

    if (refreshToken) {
      try {
        const decodedToken = jwt.verify(refreshToken, process.env.SECRET);
        if (typeof decodedToken === "string") {
          // If the decoded token is a string, it's an error message
          throw new Error(decodedToken);
        }
        //in case the refreshToken is valid we create a new refreshToken and accessToken
        const { _id, role } = decodedToken as VerifyToken;
        const user = await User.findOne({_id});
        if(user?.refresh_token != refreshToken) {
          // in case the refreshToken from cookies not equal to the refreshToken in db we suspect to burglary
          throw new Error('Signup again');
        }
        req._id = _id;
        req.role = role;
        const newRefreshToken = generateToken({ _id, role }, "60m");
        const newAccessToken = generateToken({ _id, role }, "15m");
        if (user) {
          user.refresh_token = newRefreshToken;
          await user.save();
        }
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          sameSite: "none",
          maxAge: 3600000,
          secure: true,
        });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          sameSite: "none",
          maxAge: 3600000,
          secure: true,
        });
        return next();
      } catch (error) {
        const decodedToken = jwt.decode(refreshToken);
        if (typeof decodedToken === "string") {
          // If the decoded token is a string, it's an error message
          throw new Error(decodedToken);
        }
        // 
        const user = await User.findByIdAndUpdate(
          { _id:decodedToken?.id },
          { refresh_token: "" }
        );
        throw { ...errorObject, type: "RefershToken" };
      }
    } else {
      throw { ...errorObject, type: "RefershToken" };
    }
  } catch (error) {
    console.log({ error, function: "authentication" });
    return res.status(401).json(error);
  }
};

export const authenticationAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { role } = req;
  console.log("arrivad to authenticateAdmin");
  if (role == "admin") next();
  else {
    console.log("authentication admin failed");
    return res.status(401).json({ message: "unauthorized" });
  }
};
