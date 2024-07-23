import {Request, Response} from 'express';
import prisma from "../lib/prisma";

export const getAllPosts=async(req:Request,res:Response)=>{
    try{
        const allPosts=await prisma.post.findMany({

                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            username:true,
                            image:true
                        }
                    }
                }

            }
        )
        res.status(200).json(allPosts)
    }
    catch(err:any){
        return res.status(500).send({error:err.message,status:500});
    }

}


export const addPost=async (req:Request,res:Response)=>{
    try{

        const {content,image,userId}=req.body;

        const result=await prisma.post.create({
            data:{
                content,
                image,
                userId//TODO managed by auth user
            }
        })

        res.status(200).json(result);
    }
    catch(err:any){
        return res.status(500).send({error:err.message,status:500});
    }
}


export const getPostById=async (req:Request,res:Response)=>{
    try{
        const {id}=req.params
        const post=await prisma.post.findUnique({
            where:{id:Number(id)},
            include:{
                user:true
            }
        })
        if(!post){
            return res.status(404).json({error:`User with id ${id} not found`,status:404})
        }
        return res.status(200).json(post)
    }
    catch(err:any){
        return res.status(500).send({error:err.message,status:500});
    }
}

export const deletePostById=async (req:Request,res:Response)=>{
    try{

        const {id}=req.params
        const check = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: {
                user: true
            }
        });

        if (!check) {
            return res.status(404).json({ error: `Post with id ${id} not found`, status: 404 });
        }

        await prisma.post.delete({
            where:{
                id:Number(id)
            }
        })
        return res.status(200).json({"message":"Successfully deleted",status:200});

    }
    catch(err:any){
        return res.status(500).send({error:err.message,status:500});
    }
}

export const updatePostById=async (req:Request,res:Response)=>{
    try{
        const { content, image } = req.body;
        const { id } = req.params;

        const check = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: {
                user: true
            }
        });

        if (!check) {
            return res.status(404).json({ error: `Post with id ${id} not found`, status: 404 });
        }

        const updatedPost = await prisma.post.update({
            where: { id: Number(id) },
            data: {
                content,
                image
            }
        });

        return res.status(200).json(updatedPost);

    }
    catch(err:any){
        return res.status(500).send({error:err.message,status:500});
    }
}