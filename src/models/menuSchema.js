//  Schema for the Menu.  

import Joi from 'joi';

const menuItemSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  desc: Joi.string().min(10).max(500).required(),
  price: Joi.number().positive().required(),
  createdAt: Joi.date().optional(),
  modifiedAt: Joi.date().optional()
});

const updateMenuItemSchema = Joi.object({
  desc: Joi.string().min(10).max(500).optional(),
  price: Joi.number().positive().optional(),
  modifiedAt: Joi.date().optional()
});

export { menuItemSchema ,updateMenuItemSchema};