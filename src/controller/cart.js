//  The cart controller serves the cart database. Following functions are defined here. 
//  Get all carts from cart database to show the info.
//  Find a specific cart from the database by entering cart-id
//  Create a new cart. When customer selects a product from the menu, a new cart is created.
//  An existing cart can be updated by first identifying it with cart-id.
//  Remove a cart from database. 

import db from '../database/database.js';

//Show content in cart database
async function getAllCarts(){
  try{
    const carts = db.cart.find({});
    return carts;
  }catch(error){
    console.error(error)
  }
}

//Show specific cart 
async function getCart(id){
  const cart = await db.cart.findOne({ _id: id });
  if (!cart) {
    throw new Error('Cart not found');
  }
  return cart;
}
  


// Common function to handle cart operations. Checks that requested Product exists in menu.
async function handleCartOperation(cart) {
  try {
    // Extract the titles of the products from the request body
    const productTitles = cart.products.map(product => product.title);

    // Fetch only the products that are included in the request
    const menuProducts = await db.menu.find({ title: { $in: productTitles } });

    // Add price to each product in the cart
    const productsWithPrices = cart.products.map(product => {
      const menuProduct = menuProducts.find(menuProduct => menuProduct.title === product.title);
      return {
        ...product,
        price: menuProduct ? menuProduct.price : 0, // Assuming price 0 if not found, handle appropriately
      };
    });

    // Remove products that have quantity zero
    const products = productsWithPrices.filter(product => product.quantity > 0);

    // Calculate the total sum of the cart
    const totalSum = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

   // Construct response message with detailed product information
   const response = constructResponse(products, totalSum);

   return response;
 } catch (error) {
   console.log(error);
   throw error;
 }
}


// Function to construct response message with detailed product information
function constructResponse(products, totalSum) {
  const responseProducts = products.map(product => ({
    title: product.title,
    price: product.price,
    quantity: product.quantity,
    totalPrice: product.price * product.quantity
  }));

  return { products: responseProducts, totalSum };
}


//Add a new cart. Products added by name and quantity. Price is then added and taken from menu.db.

async function createCart(cart) {
  try {
    const { products, totalSum } = await handleCartOperation(cart);
    const newCart = await db.cart.insert({ products, totalSum });
    const response = constructResponse(products, totalSum);
    return  { message: "Cart created", cart: newCart, ...response };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Update an existing cart
async function updateCart(cartId, cart) {
  try {
    const existingCart = await db.cart.findOne({ _id: cartId });
    if (!existingCart) {
      throw new Error('Cart not found');
    }

    const { products, totalSum } = await handleCartOperation(cart);
    const updatedCart = await db.cart.update({ _id: cartId }, { products, totalSum });
    const response = constructResponse(products, totalSum);
    return { cart: updatedCart, ...response };
  } catch (error) {
    console.log(error);
    throw error;
  }
}


  // Delete cart by cart-id

  function deleteCart(id){
    db.cart.remove({_id:id});
  }


export {getAllCarts, getCart, createCart, updateCart, deleteCart};