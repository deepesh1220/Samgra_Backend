
const { sequelize } = require('../config/config');
require('../models/userModel'); 

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    await sequelize.sync({ alter: true }); 
    console.log('Database synchronized');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };

