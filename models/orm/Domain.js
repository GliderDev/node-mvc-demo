
module.exports = function (Sequelize, sequelize) {
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
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }

  }, {
    timestamps: false,
    freezeTableName: true
  })
  return Domain
}
