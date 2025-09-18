import Joi from "joi";

const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    role: Joi.required(),
    address: Joi.required(),
    email: Joi.required(),
    phoneNumber: Joi.required()
})

export const CreateUserDTO = schema;