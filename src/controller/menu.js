import db from '../database/database.js';

// Function to show the menu
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await db.menu.find({});
    res.send(allProducts);
  } catch (error) {
    res.status(500).send({ error: 'Could not get find the menu... no coffee for you!' });
  }
};

// Function to add menu item
async function createMenuItem(item){
  try{
    const newMenuItem = await db.menu.insert(item);
    return newMenuItem; 
    console.log(newMenuItem);
    } catch (error){
    console.error (error , 'Failed to add new menu item');
  }
  };

  // Function to validate if a title match with menu item in the menu.db
  async function findMenuItemByTitle(title) {
    try {
      const menuItem = await db.menu.findOne({ title: title });
      return menuItem;
    } catch (error) {
      console.error(error, 'Failed to find menu item in db');
      throw error;
    }
  }



  //Function to update menu item
  async function updateMenuItem(title, updatedMenuItem){
    try {
      const result = await db.menu.update({ title: title }, { $set: updatedMenuItem });
    return result;
  } catch (error) {
    console.error(error, 'Failed to update menu item');
    throw error;
  }
};

function deleteMenuItem(title){
  db.menu.remove({title:title});
}



export { getAllProducts, createMenuItem, findMenuItemByTitle, updateMenuItem, deleteMenuItem  };