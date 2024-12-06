// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const UserSchema = new Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true },
//   mobile: { type: Number, required: true },
//   password: { type: String, required: true },
//   otp: { type: Number }, 
//   otpExpires: { type: Date },
// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);


// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../config/config'); // Import sequelize instance

// const User = sequelize.define('User', {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   mobile: {
//     type: DataTypes.BIGINT,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   otp: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//   },
//   otpExpires: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
// }, {
//   timestamps: true, 
//   tableName: 'users', 
// });

// module.exports = User;

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
