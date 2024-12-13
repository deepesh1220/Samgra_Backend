const express = require('express');
const Item = require('../../models/labAndClass/item')
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

module.exports = {
  addItem,
  getItems,
  getItemById,
  getItemByictOrScId,
  updateItem,
  deleteItem,
  getItemList
};

