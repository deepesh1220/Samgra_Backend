const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/config');

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
        type: DataTypes.INTEGER,
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
      session:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
    }, {
      tableName: 'ictAndSmartClass',
      timestamps: true,
});

module.exports = ictAndSmartClass;