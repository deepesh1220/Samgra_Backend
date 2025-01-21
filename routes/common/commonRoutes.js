const express = require('express');
const router = express.Router();

const {
    getSchoolDetails,
} = require('../../controllers/common/commonController');

router.post('/get',getSchoolDetails);

module.exports = router;
