import Joi from "joi";

const schema = Joi.object({
    username: Joi.required(),
    password: Joi.required(),
});

export const LoginDTO = schema;