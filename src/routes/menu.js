import { Router } from "express";
import { getAllProducts, createMenuItem , findMenuItemByTitle, updateMenuItem, deleteMenuItem} from "../controller/menu.js";
import {menuItemSchema, updateMenuItemSchema} from "../models/menuSchema.js";
import {checkAdmin} from "../middleware/auth.js";

const router = Router();

router.get('/', getAllProducts)

//POST new menu item. Also adding a new parameter 'createdAt' to log the menu update.
//Check if inlogged user has admin-role, which give access to update menu

router.post('/',checkAdmin, async(req,res)=> {

//validate that the input menu item correspond to expected form.
const { error, value } = menuItemSchema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
//Add createdAt parameter
   const createdAt = new Date().toISOString();
   const newItem = {
  ...value, createdAt
};

//Include new menu item in response. Response info from the request body.
try {
  await createMenuItem(newItem);
  res.json({ 
    message: "Menu item added successfully", 
    item: newItem  // Use the newItem data from the request body
  });
} catch (error) {
  res.status(500).json({ error: 'Failed to add new menu item', details: error.message });
}
});

//Uppdate menu item. Add parameter 'modifiedAt'.
router.put('/:title',checkAdmin, async (req,res)=>{
//Check if the entered menu-item exists in database.
  try {
    const menuItem = await findMenuItemByTitle(req.params.title);
    if (!menuItem) {
      return res.status(404).json({ error: 'Failed to find menu item. Is it correctly spelled?'  });
    }
//validate that the updates correspond to expected form.
    const { error, value } = updateMenuItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

 //Add modifiedAt parameter   
  const modifiedAt = new Date().toISOString();
  const updatedItem = {
    ...value, modifiedAt
  };

  await updateMenuItem(req.params.title, updatedItem);
   // The response should bring all info regarding the menu updated. Therefore the info is retreived from the database.
   const updatedMenuItem = await findMenuItemByTitle(req.params.title);

     res.json({message : "Menu updated successfully", item:updatedMenuItem});
  }catch(error){
    res.status(500).json({ error: 'Failed to update menu item', details:error.message});
  };
});

//Delete a menu item
router.delete('/:title', checkAdmin, async(req,res)=>{
  //Check if the entered menu-item exists in database.
  try {
    const menuItem = await findMenuItemByTitle(req.params.title);
    if (!menuItem) {
      return res.status(404).json({ error: 'Failed to find menu item. Is it correctly spelled?' });
    }
//Response include the name of deleted item, retreived from the url-input.
    await deleteMenuItem(req.params.title);
    res.json({ message: "Menu item deleted successfully", item:req.params.title });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item', details: error.message });
  }
});


export default router;