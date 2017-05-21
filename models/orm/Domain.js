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

var Domain = sequelize.define('domain', {
  domain_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  domain: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  }

}, {
  timestamps: false,
  freezeTableName: true
})

module.exports = Domain
