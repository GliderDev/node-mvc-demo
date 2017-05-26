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

var Subdomain = sequelize.define('sub_domain', {
  sub_domain_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  sub_domain: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  },
  domain_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }

}, {
  timestamps: false,
  freezeTableName: true
})

module.exports = Subdomain
