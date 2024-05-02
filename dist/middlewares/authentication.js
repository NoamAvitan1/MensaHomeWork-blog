"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationAdmin = exports.authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = require("../utils/generateToken");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errorObject = { message: "unauthorized" };
    console.log("arrivad to authenticate");
    try {
        // checking if the access token is valid
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        if (!process.env.SECRET) {
            console.error("SECRET is not defined in the environment variables");
            throw new Error("SECRET is not defined"); // Exit the process if SECRET is not defined
        }
        if (accessToken) {
            try {
                // checking that the access token is not expired
                const decodedToken = jsonwebtoken_1.default.verify(accessToken, process.env.SECRET);
                if (typeof decodedToken === "string") {
                    // If the decoded token is a string, it's an error message
                    throw new Error(decodedToken);
                }
                const { _id, role } = decodedToken;
                req._id = _id;
                req.role = role;
                return next();
            }
            catch (_a) {
                //if the access token expired, we need to continue and check if the refresh token is valid
            }
        }
        else {
            throw Object.assign(Object.assign({}, errorObject), { type: "accessToken" });
        }
        if (refreshToken) {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(refreshToken, process.env.SECRET);
                if (typeof decodedToken === "string") {
                    // If the decoded token is a string, it's an error message
                    throw new Error(decodedToken);
                }
                //in case the refreshToken is valid we create a new refreshToken and accessToken
                const { _id, role } = decodedToken;
                const user = yield userModel_1.default.findOne({ _id });
                if ((user === null || user === void 0 ? void 0 : user.refresh_token) != refreshToken) {
                    // in case the refreshToken from cookies not equal to the refreshToken in db we suspect to burglary
                    throw new Error('Signup again');
                }
                req._id = _id;
                req.role = role;
                const newRefreshToken = (0, generateToken_1.generateToken)({ _id, role }, "60m");
                const newAccessToken = (0, generateToken_1.generateToken)({ _id, role }, "15m");
                if (user) {
                    user.refresh_token = newRefreshToken;
                    yield user.save();
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
            }
            catch (error) {
                const decodedToken = jsonwebtoken_1.default.decode(refreshToken);
                if (typeof decodedToken === "string") {
                    // If the decoded token is a string, it's an error message
                    throw new Error(decodedToken);
                }
                // 
                const user = yield userModel_1.default.findByIdAndUpdate({ _id: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id }, { refresh_token: "" });
                throw Object.assign(Object.assign({}, errorObject), { type: "RefershToken" });
            }
        }
        else {
            throw Object.assign(Object.assign({}, errorObject), { type: "RefershToken" });
        }
    }
    catch (error) {
        console.log({ error, function: "authentication" });
        return res.status(401).json(error);
    }
});
exports.authentication = authentication;
const authenticationAdmin = (req, res, next) => {
    const { role } = req;
    console.log("arrivad to authenticateAdmin");
    if (role == "admin")
        next();
    else {
        console.log("authentication admin failed");
        return res.status(401).json({ message: "unauthorized" });
    }
};
exports.authenticationAdmin = authenticationAdmin;
