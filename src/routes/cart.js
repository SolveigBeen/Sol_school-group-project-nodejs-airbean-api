import express from "express";
import { getAllCarts, getCart, createCart, updateCart, deleteCart } from "../controller/cart.js";
import checkIfProductExists from '../middleware/checkIfProductExists.js';
import validateCart from '../middleware/validateCart.js';

const router = express.Router();

//Show all carts 
router.get('/',  async(req, res)=> {
const carts = await getAllCarts();
res.json({carts:carts});
})

//Show specific cart by entering id 
router.get('/:id', async (req, res) => {
  try {
    const cart = await getCart(req.params.id);
    res.json({ cart: cart });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

//Add product in a new cart. Check that product exist in menu. 
router.post('/', validateCart, checkIfProductExists, async (req, res) => {
  try {
    const newCart = await createCart(req.body);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Update a cart by identifying with id. Updates includes, adding new product, removing product or updating quantity.
router.put('/:id', validateCart, checkIfProductExists, async (req, res) => {
  try {
    const cartId = req.params.id;
    const updates = req.body;
    const updatedCart = await updateCart(cartId, updates);
    res.json({ message: "Cart updated", cart: updatedCart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Delete cart by id
router.delete('/:id', (req,res)=> {
  deleteCart(req.params.id);
  res.json({message : "Cart removed."});
});

export default router;