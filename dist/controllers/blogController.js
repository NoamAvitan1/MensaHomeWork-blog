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
exports.getBlog = exports.updateBlog = exports.deleteBlogs = exports.createBlogs = void 0;
const blogModel_1 = __importDefault(require("../models/blogModel"));
const mongoose_1 = require("mongoose");
const userModel_1 = __importDefault(require("../models/userModel"));
const createBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.body.author)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }
        // Check if the user with the provided author ID exists
        const existingUser = yield userModel_1.default.findById(req.body.author);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const blog = new blogModel_1.default(req.body);
        yield blog.save();
        return res.json(blog);
    }
    catch (error) {
        console.log(error);
        return res.status(502).json({ error });
    }
});
exports.createBlogs = createBlogs;
const deleteBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blog = yield blogModel_1.default.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error, location: "delete blog" });
    }
});
exports.deleteBlogs = deleteBlogs;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blog = yield blogModel_1.default.findByIdAndUpdate(id, req.body);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateBlog = updateBlog;
const getBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: _id } = req.params;
        const blog = yield blogModel_1.default.findOne({ _id });
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getBlog = getBlog;
