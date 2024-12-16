const express = require('express');
const router = express.Router();

const {
    createForm,
    getForm,
    getById,
    getByUdise,
    updateForm,
    deleteForm,
} = require('../../controllers/labAndClass/ictAndSmartClassController');

router.post('/add', createForm);
router.get('/get', getForm);
router.get('/get/:id',getById);
router.post('/get-by-udise',getByUdise);
router.put('/update/:id', updateForm);
router.delete('/delete/:id', deleteForm);

module.exports = router;
