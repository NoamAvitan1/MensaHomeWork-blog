"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middlewares/authentication");
const blogController_1 = require("../controllers/blogController");
const router = express_1.default.Router();
// get blog
router.get('/get/:id', authentication_1.authentication, blogController_1.getBlog);
// create blog
router.post('/create', authentication_1.authentication, blogController_1.createBlogs);
// delete blog
router.delete('/delete/:id', authentication_1.authentication, authentication_1.authenticationAdmin, blogController_1.deleteBlogs);
// update blog
router.put("/update/:id", authentication_1.authentication, authentication_1.authenticationAdmin, blogController_1.updateBlog);
exports.default = router;
