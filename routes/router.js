const express = require('express');
const router = express.Router();
const authRoutes = require('./auth/authRoutes');
const labClass = require('./labAndClass/itemRoutes');
const ictAndSmartClass = require('./labAndClass/ictAndSmartClassRoutes');


router.use('/auth', authRoutes);
router.use('/lab-class',labClass);
router.use('/ict&smartclass',ictAndSmartClass);

module.exports = router;