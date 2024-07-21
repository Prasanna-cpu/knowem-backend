

import express, {Router} from "express"
import {addUser, deleteUserById, getAllUsers, getUserById} from "../controllers/userController";

const userRouter=express.Router()

userRouter.get("/",getAllUsers)
userRouter.post("/",addUser)
userRouter.get("/:id",getUserById)
userRouter.delete("/:id",deleteUserById)
userRouter.put("/:id",getUserById)


export default userRouter

