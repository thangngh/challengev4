import Joi from "joi";

const schema = Joi.object({
    phoneNumber: Joi.required()
});

export const RegisterPhoneDTO = schema;