const ictAndSmartClass = require('../../models/labAndClass/ictAndSmartClass');
const successResponse = require('../../utils/successResponse');
const CustomError = require('../../utils/customError');

const createForm = async (req, res) => {
  try {
    const data = await ictAndSmartClass.create(req.body);
    successResponse(res, 201, 'IctAndSmartClass created successfully', data);
  } catch (error) {
    new CustomError(error.message, 400).sendErrorResponse(res);
  }
};

const getForm = async (req, res) => {
  try {
    const data = await ictAndSmartClass.findAll();
    successResponse(res, 200, 'IctAndSmartClass retrieved successfully', data);
  } catch (error) {
    new CustomError(error.message, 400).sendErrorResponse(res);
  }
};

const getById = async (req,res) =>{
    const {id} = req.params;
    try {

        const form = await ictAndSmartClass.findByPk(id);
        if(!form){
            throw new CustomError('IctAndSmartClass form not found', 404);
        }
        successResponse(res, 200, 'IctAndSmartClass retrieved successfully', form);
      } catch (error) {
        new CustomError(error.message, 400).sendErrorResponse(res);
      }
}

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
      throw new CustomError('IctAndSmartClass form not found', 404);
    }
  } catch (error) {
    new CustomError(error.message, 400).sendErrorResponse(res);
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
      throw new CustomError('IctAndSmartClass not found', 404);
    }
  } catch (error) {
    new CustomError(error.message, 400).sendErrorResponse(res);
  }
};

module.exports = {
  createForm,
  getForm,
  getById,
  updateForm,
  deleteForm,
};
