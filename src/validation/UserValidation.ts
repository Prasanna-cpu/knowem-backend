import Joi from "joi"


export const AddUserSchema=Joi.object({
    email:Joi.string().email().required(),
    name:Joi.string().required(),
    username:Joi.string().max(100).min(3).required(),
    image:Joi.string().uri().optional(),
    bio:Joi.string().optional(),
    isVerified:Joi.boolean().default(false)
})

export const UpdateUserSchema=Joi.object({
    email: Joi.string().email().optional(),
    name: Joi.string().optional(),
    username: Joi.string().optional(),
    image: Joi.string().uri().optional(),
    bio: Joi.string().optional(),
    isVerified: Joi.boolean().optional()
})