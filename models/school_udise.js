const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

const SchoolUdise = sequelize.define('SchoolUdise', {
  district_cd: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  district_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  block_cd: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  block_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cluster_cd: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  cluster_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  lgd_ward_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  lgd_ward_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  lgd_village_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  lgd_vill_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  udise_sch_code: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false
  },
  school_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  assembly_cons_cd: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  assembly_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  sch_loc_r_u: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  sch_category_id: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  sch_type: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  sch_mgmt_id: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  pmshri_sages: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  class_frm: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  class_to: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: true
  }
}, {
  tableName: 'school_udise',
  timestamps: false
});

module.exports = SchoolUdise;
