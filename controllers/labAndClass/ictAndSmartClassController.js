const ictAndSmartClass = require('../../models/labAndClass/ictAndSmartClass');
const mstItem = require('../../models/labAndClass/item');
const { sequelize } = require('../../config/config');
const successResponse = require('../../utils/successResponse');
const customError = require('../../utils/customError');

// imp note => used in database 1 = yes , 2 = no 
// ICT lab = 1 , Smart Class = 2

// const createForm = async (req, res) => {
//   try {
//     const data = await ictAndSmartClass.create(req.body);
//     successResponse(res, 201, 'IctAndSmartClass created successfully', data);
//   } catch (error) {
//     new customError(error.message, 400).sendErrorResponse(res);
//   }
// };

const createForm = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const duplicateEntries = await Promise.all(
        req.body.map(async (item) => {
          return await ictAndSmartClass.findOne({
            where: {
              udise_sch_code: item.udise_sch_code,
              itemId: item.itemId,
            },
          });
        })
      );

      const duplicates = duplicateEntries.filter(entry => entry !== null);
      if (duplicates.length > 0) {
        return new customError(
          `Duplicate entries found for udise_sch_code and itemId`,
          400
        ).sendErrorResponse(res);
      }

      const data = await ictAndSmartClass.bulkCreate(req.body);
      successResponse(res, 201, 'IctAndSmartClass entries created successfully', data);
    } else {
      const exists = await ictAndSmartClass.findOne({
        where: {
          udise_sch_code: req.body.udise_sch_code,
          itemId: req.body.itemId,
        },
      });

      if (exists) {
        return new customError(
          `Duplicate entry found for udise_sch_code: ${req.body.udise_sch_code} and itemId: ${req.body.itemId}`,
          400
        ).sendErrorResponse(res);
      }

      // Insert single record
      const data = await ictAndSmartClass.create(req.body);
      successResponse(res, 201, 'IctAndSmartClass created successfully', data);
    }
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
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
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

const updateByUdiseId = async (req, res) => {
  try {
    const { udise_sch_code } = req.params; 
    const [updated] = await ictAndSmartClass.update(req.body, {
      where: { udise_sch_code }, 
    });

    if (updated) {
      const updatedData = await ictAndSmartClass.findAll({
        where: { udise_sch_code },
      }); 
      successResponse(res,200,'IctAndSmartClass updated successfully',updatedData);
    } else {
      throw new customError('No records found for the given udise_sch_code', 404);
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
  updateByUdiseId,
  deleteForm,
};
