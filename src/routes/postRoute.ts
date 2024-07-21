import express from 'express';
import {addPost, deletePostById, getAllPosts, getPostById, updatePostById} from "../controllers/postController";

const postRouter=express.Router()

postRouter.get("/",getAllPosts)
postRouter.post("/",addPost)
postRouter.post("/:id",getPostById)
postRouter.put("/:id",updatePostById)
postRouter.delete("/:id",deletePostById)

export default postRouter