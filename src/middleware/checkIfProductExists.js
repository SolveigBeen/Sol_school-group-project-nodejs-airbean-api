import db from "../database/database.js";

const checkIfProductExists = async (req, res, next) => {
  try {
    const { products } = req.body;

    // Fetch all products from the menu
    const menuProducts = await db.menu.find({});

    // Check if all products in the cart exist in the menu
    const productsExist = products.every(product =>
      menuProducts.some(menuProduct => menuProduct.title === product.title)
    );

    if (!productsExist) {
      return res.status(400).json({ error: "One or more products are not available in the menu" });
    }

    next();
  } catch (error) {
    console.error("Error in checkIfProductExists middleware:", error);
    res.status(500).json({ error: "Failed to verify products" });
  }
};

export default checkIfProductExists;