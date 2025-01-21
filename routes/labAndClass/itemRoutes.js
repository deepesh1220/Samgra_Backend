const express = require('express');
const router = express.Router();

const {
    addItem,
  getItems,
  getItemById,
  getItemByictOrScId,
  updateItem,
  deleteItem,
  getItemList,

   //for mst_sub_item
   addSubItem,
   getSubItems,
   getSubItemsByItemId,
   updateSubItem,
   deleteSubItem,
} = require('../../controllers/labAndClass/itemController');

router.get('/itemlist',getItemList);
router.post('/add', addItem);
router.get('/get-items', getItems);
router.post('/getByictOrscId',getItemByictOrScId);
router.get('/get-item/:id', getItemById);
router.put('/update-item/:id', updateItem);
router.delete('/delete-item/:id', deleteItem);

//for mst_sub_item
router.post('/addSubItem',addSubItem);
router.get('/getSubItems',getSubItems);
router.post('/getSubItemsByItemId',getSubItemsByItemId);
router.put('/updateSubItem',updateSubItem);
router.delete('/deleteSubItem',deleteSubItem);


module.exports = router;
