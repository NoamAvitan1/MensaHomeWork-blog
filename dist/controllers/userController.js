"use strict";
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
exports.signUser = exports.loginUser = void 0;
const generateToken_1 = require("../utils/generateToken");
const userModel_1 = __importDefault(require("../models/userModel"));
//login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let user = yield userModel_1.default.login(email, password);
        const refreshToken = (0, generateToken_1.generateToken)({ _id: user._id, role: user.role }, "60m");
        const accessToken = (0, generateToken_1.generateToken)({ _id: user._id, role: user.role }, "15m");
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
        yield user.save();
        user.refresh_token = "******";
        user.password = "******";
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});
exports.loginUser = loginUser;
//signup user
const signUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, role } = req.body;
    try {
        if (!name) {
            throw Error("Name is required");
        }
        let user = yield userModel_1.default.signup(email, password, name, role);
        const refreshToken = (0, generateToken_1.generateToken)({ _id: user._id, role: user.role }, "60m");
        const accessToken = (0, generateToken_1.generateToken)({ _id: user._id, role: user.role }, "15m");
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
        yield user.save();
        user.password = "******";
        user.refresh_token = "******";
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});
exports.signUser = signUser;
