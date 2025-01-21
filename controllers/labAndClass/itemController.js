const express = require('express');
const Item = require('../../models/labAndClass/item')
const SubItem = require('../../models/labAndClass/subItem')
const { sequelize } = require('../../config/db');
const successResponse = require('../../utils/successResponse')
const customError = require('../../utils/customError');

const getItemList = async(req,res,next)=>{

  try{
      const items = await Item.findAll();
      return res.status(201).json({
        success: true,
        message: 'Item list successfully fetched',
        data: items,
      }) 
  }catch(error){
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
}

const addItem = async (req, res) => {
  try {
    const { itemName, itemType, ictLab, smartClass, other,status } = req.body;

    if(!itemName || !itemType || !ictLab || !smartClass || !other || !status){

      throw new customError('All fields are required for each item',401);
    }

    const newItem = await Item.create({
      itemName,
      itemType,
      ictLab, 
      smartClass, 
      other,
      status,
    });
    return successResponse(res,201,'Iteam successfully added!',newItem);

  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    if(!items){
    throw new customError('item not found ',404);
    }
    return successResponse(res,201,'Iteam successfully fetched!',{
      itemId: items.itemId,
      itemName: items.itemName,
    });

  } catch (error) {
 
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);

    if (!item) {
     
      throw new customError('item not found ',404);
    }
    return successResponse(res,201,'Iteam successfully fetched!',item);
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

const getItemByictOrScId = async (req, res) => {
  try {
    const { ictLab, smartClass } = req.body;

    const filter = {};
    if (ictLab) filter.ictLab = parseInt(ictLab);
    if (smartClass) filter.smartClass = parseInt(smartClass);

    const items = await Item.findAll({
      where: filter,
    });

    if (!items || items.length === 0) {
      throw new customError('item not found ',404);
    }

    const filteredData = items.map(item => ({
      itemId: item.itemId,
      itemName: item.itemName,
    }));

    return successResponse(res, 200, 'Items successfully fetched!', filteredData);
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};


const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName,itemType, description, sectionId, sectionName } = req.body;

    const updated = await Item.update(
      { itemName,itemType, description, sectionId, sectionName },
      { where: { itemId: id } }
    );

    if (!updated[0]) {
    throw new customError('Item not found or no changes made ',404);
    }
    return successResponse(res,201,'Iteam successfully fetched!',updated);
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Item.destroy({ where: { itemId: id } });

    if (!deleted) {
      throw new customError('Item not found ',404);
    }
    return successResponse(res,200,'Item deleted successfully');
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

// ***For mst_sub_item***
const addSubItem = async (req, res) => {
  try {
    const { itemId, subItemName, description, status } = req.body;

    if (!itemId || !subItemName || !status) {
      throw new customError('All required fields must be provided', 401);
    }

    const itemExists = await Item.findByPk(itemId);
    if (!itemExists) {
      throw new customError('Referenced item not found', 404);
    }

    const newSubItem = await SubItem.create({
      itemId,
      subItemName,
      description,
      status,
    });

    return successResponse(res, 201, 'Sub-item successfully added!', newSubItem);
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

const getSubItems = async (req, res) => {
  try {
    const subItems = await SubItem.findAll({
      include: {
        model: Item,
        as: 'item', 
        attributes: ['itemName', 'itemType'], 
      },
    });

    if (!subItems || subItems.length === 0) {
      throw new customError('No sub-items found', 404);
    }

    return successResponse(res, 200, 'Sub-items successfully fetched!', subItems);
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

const getSubItemsByItemId = async (req, res) => {
  try {
    const { itemId } = req.body;

    const subItems = await SubItem.findAll({
      where: { itemId },
      include: {
        model: Item,
        as: 'item',
        attributes: ['itemName', 'itemType'],
      },
    });

    if (!subItems || subItems.length === 0) {
      throw new customError('No sub-items found for the given item ID', 404);
    }

    return successResponse(res, 200, 'Sub-items successfully fetched!', subItems);
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

const updateSubItem = async (req, res) => {
  try {
    const { subItemId } = req.body;
    const { subItemName, description, status } = req.body;

    const updated = await SubItem.update(
      { subItemName, description, status },
      { where: { subItemId: subItemId } }
    );

    if (!updated[0]) {
      throw new customError('Sub-item not found or no changes made', 404);
    }

    return successResponse(res, 200, 'Sub-item successfully updated!');
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

const deleteSubItem = async (req, res) => {
  try {
    const { subItemId } = req.body;

    const deleted = await SubItem.destroy({ where: { subItemId: subItemId } });

    if (!deleted) {
      throw new customError('Sub-item not found', 404);
    }

    return successResponse(res, 200, 'Sub-item successfully deleted!');
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

module.exports = {
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
};

