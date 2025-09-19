import Joi from "joi";

const schema = Joi.object({
  email: Joi.string().email().required(),
  accessCode: Joi.string().length(6).required(),
});

export const VerifyEmailDTO = schema;