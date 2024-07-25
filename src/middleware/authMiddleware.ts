import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import {Request, Response,NextFunction} from "express";
import {User} from "@prisma/client";


type AuthRequest=Request & {
    user?:User
}

export async function authenticateToken(
    req:AuthRequest,
    res:Response,
    next:NextFunction
){


    // @ts-ignore
    try{
        const header=req.headers["authorization"]

        const token=header?.split(" ")[1];

        if(!token){
            return res.sendStatus(401)
        }

        // @ts-ignore
        const payload=jwt.verify(token,process.env.SECRET) as {
            tokenId:number
        }


        const dbtoken=await prisma.token.findUnique({
            where:{
                id:payload.tokenId,
            },
            include:{user:true}
        })

        // console.log(dbtoken)

        // @ts-ignore
        if(!dbtoken?.valid){
            return res.status(401).json({
                error:"API Token not valid / expired "
            })
        }

        // @ts-ignore
        req.user = dbtoken.user;
    }
    catch(err:any){
        res.status(500).send({error:err.message,status:500});
    }
    next()
}