const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/config');
const mstItem = require('./item');

const mstSubItem = sequelize.define('mst_sub_item', {
  subItemId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: mstItem,
      key: 'itemId',
    },
    onDelete: 'CASCADE', //Specify behavior on deletion of the parent
    onUpdate: 'CASCADE', //Specify behavior on update of the parent
  },
  subItemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
}, {
  tableName: 'mst_sub_item',
  timestamps: true,
});

mstItem.hasMany(mstSubItem, { foreignKey: 'itemId', as: 'subItems' });
mstSubItem.belongsTo(mstItem, { foreignKey: 'itemId', as: 'item' });

module.exports = mstSubItem;
