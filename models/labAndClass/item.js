const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/config'); 

const mstItem = sequelize.define('mst_item', {
  itemId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ictLab: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  smartClass: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  other: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  status: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
}, {
  tableName: 'mst_item',
  timestamps: true,
});

module.exports = mstItem;
