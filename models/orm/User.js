var config = require('../../lib/config')
var Sequelize = require('sequelize')

var sequelize = new Sequelize(
  config.orm.db,
  config.orm.user,
  config.orm.password, {
    // Disables console logging queries
    logging: false
  }
)

var User = sequelize.define('user', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password_reset_token: {
    type: Sequelize.STRING,
    allowNull: true
  },
  dob: {
    type: Sequelize.DATEONLY,
    allowNull: true
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  emp_code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  doj: {
    type: Sequelize.DATEONLY,
    allowNull: true
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  auth_key: {
    type: Sequelize.STRING,
    allowNull: true
  },
  profile_pic: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, {
  timestamps: false,
  freezeTableName: true
})

module.exports = User
