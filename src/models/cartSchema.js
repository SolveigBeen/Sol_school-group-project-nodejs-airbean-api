//  Schema for cart.  Product name and quantity. Several products can be added as an array. 

import Joi from 'joi';

const productSchema = Joi.object({
  title: Joi.string().alphanum().min(3).required(),
  quantity: Joi.number().integer().min(1).required()
});

//Cart can have several products from menu.
const cartSchema = Joi.object({
  products: Joi.array().items(productSchema).min(1).required()
});

  export default cartSchema;