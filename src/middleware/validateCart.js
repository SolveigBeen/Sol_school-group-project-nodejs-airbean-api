import cartSchema from '../models/cartSchema.js';

const validateCart = (req, res, next) => {
  const { error } = cartSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validateCart;