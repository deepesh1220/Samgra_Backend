const express = require('express');
const router = express.Router();

const {
    createForm,
    getForm,
    getById,
    updateForm,
    deleteForm,
} = require('../../controllers/labAndClass/ictAndSmartClassController');

router.post('/add', createForm);
router.get('/get', getForm);
router.get('/get/:id',getById);
router.put('/update/:id', updateForm);
router.delete('/delete/:id', deleteForm);

module.exports = router;
