import express from "express";
import { register, login, logout, deleteUser } from "../controller/customer.js";
import customersDB from "../database/database.js";
import {userSchema} from "../models/userSchema.js";

const router = express.Router();

// Endpoint for user registration
router.post("/register", async (req, res)=>{
  try{
//validate that the input user data correspond to expected form.
const { error, value } = userSchema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
// Call the register function from the controller to handle user registration
  await register(req, res);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Endpoint for user login
router.post("/login", login);

// Endpoint for user logout
router.post("/logout", logout);

// Endpoint for delete user account
router.delete("/delete/:id",  (req, res)=> {
    deleteUser(req.params.id);
    res.json({ message : "User removed from database" });
  })
  

// GET endpoint to fetch all customers
router.get("/", async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await customersDB.customers.find({});
    if (customers) {
      // Send back all customers as a response
      res.json(customers);
    } else {
      // No customers found
      res.status(404).json({ error: "No customers found" });
    }
  } catch (error) {
    // Handle errors if customers cannot be fetched
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

export default router;