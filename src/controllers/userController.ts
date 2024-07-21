import {Request, Response} from 'express';
import prisma from "../lib/prisma";
import {AddUserSchema, UpdateUserSchema} from "../validation/UserValidation";

export const getAllUsers=async (req:Request,res:Response)=>{
    try{
        const allUser=await prisma.user.findMany();
        res.status(200).json(allUser);
    }
    catch(err:any){
        res.status(500).json({error:err.message,status:500});
    }
}


export const addUser=async(req:Request,res:Response)=>{
     try{
         const {error}=AddUserSchema.validate(req.body)
         if(error){
             res.status(400).json({error:error.details[0].message,status:400});
         }

         const body=req.body;
         const user=await prisma.user.create({
             data:body
         })
          return res.status(200).json(user);
     }
     catch(err:any){
         res.status(500).json({error:err.message,status:500});
     }
}


export const getUserById=async(req:Request,res:Response)=>{
    try{
        const {id}=req.params;
        const user=await prisma.user.findUnique({
            where:{id:Number(id)}
        })
        if(!user){
            return res.status(404).json({error:`User with id ${id} not found`,status:404});
        }
        return res.status(200).json(user);
    }
    catch(err:any){
        res.status(500).json({error:err.message,status:500});
    }
}

export const deleteUserById=async(req:Request,res:Response)=>{
    try{
        const {id}=req.params
        const check=await prisma.user.findUnique({
            where:{id:Number(id)}
        })
        if(!check){
            return res.status(404).json({error:`User with id ${id} not found`,status:404})
        }

        await prisma.user.delete({
            where:{id:Number(id)},
        })

        return res.status(200).json({"message":"Successfully deleted",status:200});
    }
    catch(err:any){
        res.status(500).json({error:err.message,status:500});
    }
}

export const updateUserById=async(req:Request,res:Response)=>{
    try{

        const {error}=UpdateUserSchema.validate(req.body)
        if(error){
            res.status(400).json({error:error.details[0].message,status:400});
        }

        const body=req.body;
        const {id}=req.params
        const check=await prisma.user.findUnique({
            where:{id:Number(id)}
        })
        if(!check){
            return res.status(404).json({error:`User with id ${id} not found`,status:404})
        }

        const updatedUser=await prisma.user.update({
            where:{id:Number(id)},
            data:body
        })

        return res.status(200).json(updatedUser);

    }
    catch(err:any){
        res.status(500).json({error:err.message,status:500});
    }
}