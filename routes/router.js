const express = require('express');
const router = express.Router();
const authRoutes = require('./auth/authRoutes');
const labClass = require('./labAndClass/itemRoutes');
const ictAndSmartClass = require('./labAndClass/ictAndSmartClassRoutes');
const common = require('./common/commonRoutes');


router.use('/auth', authRoutes);
router.use('/lab-class',labClass);
router.use('/ict&smartclass',ictAndSmartClass);
router.use('/cmn',common);


module.exports = router;