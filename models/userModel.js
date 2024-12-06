
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  mobileNo: {
    type: DataTypes.BIGINT,
    allowNull: true,
    validate: {
      isNumeric: true,
    },
  },
  alternateMobileNo: {
    type: DataTypes.BIGINT,
    allowNull: true,
    validate: {
      isNumeric: true,
    },
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  districtName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  blockName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('superAdmin', 'admin', 'subAdmin', 'user'),
    defaultValue: 'user',
  },
  userLevel: {
    type: DataTypes.ENUM('state', 'district', 'block', 'cluster', 'school', 'other'),
    defaultValue: 'other',
  },
  accessId: {
    type: DataTypes.ENUM('1', '2', '3', '4'),
    defaultValue: '4',
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  otpExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'users',
});

module.exports = User;
