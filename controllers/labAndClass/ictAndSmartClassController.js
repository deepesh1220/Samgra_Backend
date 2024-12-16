const ictAndSmartClass = require('../../models/labAndClass/ictAndSmartClass');
const mstItem = require('../../models/labAndClass/item');
const { sequelize } = require('../../config/config');
const successResponse = require('../../utils/successResponse');
const customError = require('../../utils/customError');

const createForm = async (req, res) => {
  try {
    const data = await ictAndSmartClass.create(req.body);
    successResponse(res, 201, 'IctAndSmartClass created successfully', data);
  } catch (error) {
    new customError(error.message, 400).sendErrorResponse(res);
  }
};

const getForm = async (req, res) => {
  try {
    const data = await ictAndSmartClass.findAll();
    successResponse(res, 200, 'IctAndSmartClass retrieved successfully', data);
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

/*
//only use for get by id ictAndSmartClass table data
const getById = async (req,res) =>{
    const {id} = req.params;
    try {

        const form = await ictAndSmartClass.findByPk(id);
        if(!form){
            throw new customError('IctAndSmartClass form not found', 404);
        }
        successResponse(res, 200, 'IctAndSmartClass retrieved successfully', form);
      } catch (error) {
        new customError(error.message, 400).sendErrorResponse(res);
      }
}
*/

// use sql query for fetch data with join method 
const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT
        ict."Id", ict."itemId", mi."itemName", ict."sectionId",
        ict.udise_sch_code, ict.received, ict."wStatus"
      FROM "ictAndSmartClass" ict
      LEFT OUTER JOIN mst_item mi ON mi."itemId" = ict."itemId"
      WHERE ict."Id" = :id
    `;

    const [result] = await sequelize.query(query, {
      replacements: { id }, 
      type: sequelize.QueryTypes.SELECT,
    });

    if (!result) {
      throw new customError('IctAndSmartClass form not found', 404);
    }

    successResponse(res, 200, 'IctAndSmartClass retrieved successfully', result);
  } catch (error) {
    new customError(error.message, 400).sendErrorResponse(res);
  }
};

//  school udise code wise 
const getByUdise = async (req, res) => {
  const { udise_sch_code } = req.body;

  try {
    const query = `
      SELECT
        ict."Id", ict."itemId", mi."itemName", ict."sectionId",
        ict.udise_sch_code, ict.received, ict."wStatus",
        CASE
          WHEN ict."sectionId" = 1 THEN 'ICT Lab'
          WHEN ict."sectionId" = 2 THEN 'Smart Class'
          ELSE 'Other'
        END AS "section_name"
      FROM "ictAndSmartClass" ict
      LEFT OUTER JOIN mst_item mi ON mi."itemId" = ict."itemId"
      WHERE ict.udise_sch_code = :udise_sch_code
    `;

    const result = await sequelize.query(query, {
      replacements: { udise_sch_code },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!result || result.length === 0) {
      throw new customError('IctAndSmartClass data not found for the given UDISE code', 404);
    }
    successResponse(res, 200, 'IctAndSmartClass data retrieved successfully', result);
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};


const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await ictAndSmartClass.update(req.body, {
      where: { Id: id },
    });
    if (updated) {
      const updatedData = await ictAndSmartClass.findByPk(id);
      successResponse(res, 200, 'IctAndSmartClass updated successfully', updatedData);
    } else {
      throw new customError('IctAndSmartClass form not found', 404);
    }
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ictAndSmartClass.destroy({
      where: { Id: id },
    });
    if (deleted) {
      successResponse(res, 200, 'IctAndSmartClass deleted successfully');
    } else {
      throw new customError('IctAndSmartClass not found', 404);
    }
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

module.exports = {
  createForm,
  getForm,
  getById,
  getByUdise,
  updateForm,
  deleteForm,
};
