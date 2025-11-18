import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "name must be exist",
    "string.base": "name must be string",
  }),
  email: Joi.string().required().messages({
    "any.required": "email must be exist",
    "string.base": "email must be string",
  }),
  phone: Joi.string().required().messages({
    "any.required": "phone must be exist",
    "string.base": "phone must be string",
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": "name must be string",
  }),
  email: Joi.string().messages({
    "string.base": "email must be string",
  }),
  phone: Joi.string().messages({
    "string.base": "email must be string",
  }),
})
  .min(1)
  .messages({ "object.min": "Body must have at least one field" });
