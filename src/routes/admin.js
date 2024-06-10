import { Router } from "express";
import {createOffering, getAllOfferings, deleteOffering} from '../controller/offerings.js';
import db from '../database/database.js';
import {checkAdmin} from '../middleware/auth.js';


const router = Router();
router.use(checkAdmin);

// Endpoint for adding a new offering
router.post('/offering', async (req, res) => {
  try {
    const { title, price, ...products } = req.body;

// Convert products object to an array of product titles
    const productTitles = Object.values(products);

// Fetch all products from the menu
      const menuProducts = await db.menu.find({});

// Check if all products in the offering exist in the menu
    const productsExist = productTitles.every(product => menuProducts.some(menuProduct => menuProduct.title === product)
  );

// If both products exist, proceed with creating the offering
if (productsExist) {
  await createOffering({ title, products:productTitles, price });
  res.json({ message: 'New offering added successfully' });
} else {
  // If any of the products are missing, return an error response
  res.status(400).json({ error: 'One or more products are not available' });
}
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Failed to add new offering' });
}
});


// Endpoint to view offerings
router.get('/offering', getAllOfferings) ;

// Endpoint to delete offerings
router.delete('/offering/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteOffering(id);
    if (result > 0) {
      res.json({ message: 'Offering deleted successfully' });
    } else {
      res.status(404).json({ error: 'Offering not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete offering' });
  }
});

export default router;