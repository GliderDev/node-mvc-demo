var Sequelize = require('sequelize')

var sequelize = new Sequelize('dmcoderepo', 'root', 'pass')

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
