//  Schema for Customers and users.

import Joi from 'joi';

const userSchema = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  password: Joi.string().min(6).max(500).required(),
  phone: Joi.number().positive().required(),
  email:Joi.string().min(6).max(100).required(),
  role: Joi.string().valid('admin', 'user', 'guest').optional(),
 });

export { userSchema };