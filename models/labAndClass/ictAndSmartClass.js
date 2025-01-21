const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/config');

// imp note => used in database 1 = yes , 2 = no 


const ictAndSmartClass = sequelize.define('ictAndSmartClass',{
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      udise_sch_code: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      sectionId: {
        type: DataTypes.INTEGER,   // ICT lab = 1 , Smart Class = 2
        allowNull: false,       
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      received: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receivedQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      installed: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      installedQty: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      wStatus:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      wStatusQty:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      workingQty:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      usedPlace:{
        type: DataTypes.ENUM('classroom', 'other-place'),
        allowNull: true,
      },
      notWorkingQty:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      notWorkingReason:{
        type: DataTypes.ENUM('damaged','repairable','theft'),
        allowNull: true,
      },    
      session:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
    }, {
      tableName: 'ictAndSmartClass',
      timestamps: true,
});

module.exports = ictAndSmartClass;