import express,{Router} from "express";
import { loginUser, signUser } from "../controllers/userController";

const router:Router = express.Router();

// login user
router.post('/login',loginUser)

// signup route
router.post('/signup',signUser)


export default router;