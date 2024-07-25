import {Router} from 'express';
import {authenticate, login} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/login",login)


authRouter.post("/authenticate",authenticate)

export default authRouter;