module.exports = function (Sequelize, sequelize) {
  var Codebase = sequelize.define('codebase', {
    codebase_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
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
    author_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    uploaded_on: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    updated_on: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    downloads: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    file_path: {
      type: Sequelize.STRING,
      allowNull: true
    },
    reference: {
      type: Sequelize.STRING,
      allowNull: true
    },
    projects: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    timestamps: false,
    freezeTableName: true
  })
  return Codebase
}
