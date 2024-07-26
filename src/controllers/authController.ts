import {Request,Response} from "express";
import {generateAuthToken, tokenGenerator} from "../lib/TokenGenerator";
import prisma from "../lib/prisma";
import {sendEmailToken} from "../service/email";

const EMAIL_EXPIRATION_MIN=50
const AUTH_EXPIRATION_HOURS=10


export const login=async (req:Request, res:Response) => {
    try{
        const {email}=req.body

        const emailToken=tokenGenerator()
        const expiration=new Date(new Date().getTime()+EMAIL_EXPIRATION_MIN * 60 *1000)

        // @ts-ignore
        const createToken=await prisma.token.create({

            data:{
                type:"EMAIL",
                emailToken,
                expiration,
                user:{
                    connectOrCreate:{
                        where:{
                            email
                        },
                        create:{
                            email,
                        }
                    }
                }
            }

        })

        console.log(createToken)

        await sendEmailToken(email,emailToken);

        res.status(200).json(createToken);
    }
    catch(err:any){
        res.status(500).send({status:500,message:err.message});
        throw err
    }
}


export const authenticate=async (req:Request, res:Response) => {
    try{
        const {email,emailToken}=req.body
        console.log(email,emailToken)


        const dbEmailToken=await prisma.token.findUnique({
            where:{emailToken},
            include:{
                user:true
            }
        })
        console.log(dbEmailToken)


        if(!dbEmailToken || !dbEmailToken.valid){
            return res.sendStatus(401)
        }

        if(dbEmailToken.expiration<new Date()){
            return res.status(401).json({
                error:"Token expired",
                status:401
            })
        }

        if(dbEmailToken?.user?.email !== email){
            return res.sendStatus(401)
        }

        //after validating user , generate API token

        const expiration=new Date(
            new Date().getTime()+AUTH_EXPIRATION_HOURS*60*60*1000
        )


        const apiToken=await prisma.token.create({
            data:{
                type:"API",
                expiration,
                user:{
                    connect:{
                        email
                    }
                }

            }
        })

        //invalidate
        await prisma.token.update({
            where:{
                id:dbEmailToken.id,
            },
            data:{
                valid:false
            }

        })

        //jwt token generation
        const authToken=generateAuthToken(apiToken.id)

        return res.json({authToken})

    }
    catch(err:any){
        res.status(500).send({status:500,message:err.message});
        throw err
    }
}