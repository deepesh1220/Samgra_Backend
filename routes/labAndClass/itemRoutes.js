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
} = require('../../controllers/labAndClass/itemController');

router.get('/itemlist',getItemList);
router.post('/add', addItem);
router.get('/get-items', getItems);
router.post('/getByictOrscId',getItemByictOrScId);
router.get('/get-item/:id', getItemById);
router.put('/update-item/:id', updateItem);
router.delete('/delete-item/:id', deleteItem);

module.exports = router;
