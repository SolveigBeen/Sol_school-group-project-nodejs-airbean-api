import db from '../database/database.js';

const createOffering = async(offering)=> {
  try{
const newOffering = await db.offerings.insert(offering);
console.log(newOffering);
return newOffering;
}catch (error){
  console.error(error);
  throw error;
}
}


const getAllOfferings = async (req, res) => {
  try {
    const allOfferings = await db.offerings.find({});
    res.send(allOfferings);
  } catch (error) {
    res.status(500).send({ error: 'Could not find any offerings!' });
  }
};

const deleteOffering = async (id) => {
  try {
    const result = await db.offerings.remove({ _id: id });
    return result; // Return the number of documents removed
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {createOffering, getAllOfferings, deleteOffering}