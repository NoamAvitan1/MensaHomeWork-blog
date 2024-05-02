import express,{Router} from "express";
import { authentication, authenticationAdmin } from "../middlewares/authentication";
import { createBlogs, deleteBlogs, getBlog, updateBlog } from "../controllers/blogController";

const router:Router = express.Router();

// get blog
router.get('/get/:id',authentication,getBlog);

// create blog
router.post('/create',authentication,createBlogs);

// delete blog
router.delete('/delete/:id',authentication,authenticationAdmin,deleteBlogs);

// update blog
router.put("/update/:id",authentication,authenticationAdmin,updateBlog);
export default router;