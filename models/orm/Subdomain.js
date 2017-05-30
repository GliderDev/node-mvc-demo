
module.exports = function (Sequelize, sequelize) {
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

  return Subdomain
}
