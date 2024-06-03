import db from "../database/database.js";

// Function for cart
const addToCart = async (req, res, next) => {
  const productID = req.body.product;
  const cartID = req.body.cartID;
  const quantity = req.body.quantity ? req.body.quantity : 1;
  const coffeeQuery = await db["menu"].findOne({ _id: productID });

  const queryWithQuantity = {
    ...coffeeQuery,
    quantity: quantity,
  };
  // Check if cartID is provided
  if (cartID) {
    // Check if cartID is in database
    const cartQuery = await db["cart"].findOne({ _id: cartID });
    // Check if product is already added
    const productExists = cartQuery.product.some(
      (product) => product._id === productID
    );
    if (productExists) {
      // Find index of the existing product
      const productIndex = cartQuery.product.findIndex(
        (product) => product._id === productID
      );

      // Calculate new quantity
      const newQuantity = quantity + cartQuery.product[productIndex].quantity;

      // Update the document
      try {
        const updateResult = await db.cart.update(
          { _id: cartID },
          {
            $set: {
              [`product.${productIndex}.quantity`]: newQuantity,
            },
          },
          { returnUpdatedDocs: true } // This option will return the updated document
        );
        return res.status(200).json(updateResult);
      } catch {
        return res.status(500).send({ message: "Could not update database" });
      }
    }
    // Add new product
    else {
      // Add new product to the product array
      try {
        const result = await db.cart.update(
          { _id: cartID },
          { $push: { product: queryWithQuantity } },
          { returnUpdatedDocs: true } // This option will return the updated document
        );

        return res.status(200).json(result);
      } catch {
        return res.status(500).json({ message: "Error updating document" });
      }
    }
  } else {
    try {
      const inputQuery = await db["cart"].insert({
        customerID: req.body.customerID ? req.body.customerID : "",
        product: [queryWithQuantity],
      });
      const cartID = inputQuery._id;
      const instructions =
        "cartID would've been saved to session/cookie to be included in the next call";
      const message = { ...inputQuery, instructions };
      res.status(200).json(message);
    } catch {
      return res.status(500).json({ message: "Error updating document" });
    }
  }
};
// Show cart
const showCart = async (req, res) => {
  try {
    const allCartProducts = await db.cart.find({});
    res.send(allCartProducts);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Could not get find the cart... no coffee for you!" });
  }
};

const placeOrder = async (req, res, next) => {
  // Vet inte om jag behöver cartID
  const { customerID, cartID, guestInfo } = req.body;
  const orderTime = formatDate(new Date());

  let orderCustomerID = customerID;

  try {
    if (!orderCustomerID && guestInfo) {
      const { email, phone } = guestInfo;
      if (!email || !phone) {
        return res
          .status(400)
          .json({ message: "Guest email and phone are required" });
      }

      // Create a guest entry if not logged in
      const guestCustomer = await db["customers"].insert({
        username: "guest",
        email: guestInfo.email,
        phone: guestInfo.phone,
      });
      orderCustomerID = guestCustomer._id;
    }

    if (orderCustomerID && !guestInfo) {
      const customer = await db["customers"].findOne({ _id: orderCustomerID });
      if (!customer) {
        return res.status(400).json({ message: "Customer not found" });
      }
    }

    // Check if customerID or guestInfo is provided
    if (!orderCustomerID) {
      return res
        .status(400)
        .json({ message: "customerID or valid GuestInfo is required" });
    }

    // Calculate estimated delivery time
    const estimatedDelivery = formatDate(new Date(Date.now() + 20 * 60 * 1000));

    const newOrder = {
      customerID: orderCustomerID,
      cartID: cartID,
      date: orderTime,
      estimatedDelivery: estimatedDelivery,
    };

    const savedOrder = await db["orders"].insert(newOrder);

    res.json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  next();
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

//Delete full order
//Insomnina URL: localhost:8000/cart
//BODY:
/* {
	"_id":"1STi9KugGouyFUr5"          Välj rätt id från cart
} */

const deleteOrder = async (cartID) => {
  try {
    console.log("searching for item with cartID:", cartID);
    const cartItem = await db["cart"].findOne({ _id: cartID });
    console.log("THE CART ITEM", cartItem);
    if (!cartItem) {
      throw new Error("Item not found");
    }

    const deleteCart = await db["cart"].remove({ _id: cartID }, {});
    console.log("Item removed", deleteCart);

    return deleteCart;
  } catch (error) {
    console.error("Error removing item from cart", error);
    throw error;
  }
};

//Delete specific item in order
//Insomnina URL: localhost:8000/cart/item
//BODY:
/* {
	"cartID": "5J0W9gjuFH9oWvCZ",          Välj rätt id från cart
  "productID" : "lN2tmDgmhBl1Mc6k"       Välj rätt id från cart
} */

const deleteItemInOrder = async (cartID, productID) => {
  try {
    const cartItem = await db["cart"].findOne({ _id: cartID });

    if (!cartItem) {
      throw new Error("Item not found");
    }

    const updateProducts = cartItem.product.filter((p) => p._id !== productID);
    console.log("updateProducts", updateProducts);

    const numUpdated = await db["cart"].update(
      { _id: cartID },
      { $set: { product: updateProducts } },
      {}
    );

    return numUpdated;
  } catch (error) {
    console.error("Error removing specific item from cart", error);
  }
};

export {
  addToCart,
  deleteOrder,
  deleteItemInOrder,
  showCart,
  placeOrder,
  formatDate,
};
