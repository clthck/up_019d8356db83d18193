'use strict';
module.exports = function(sequelize, DataTypes) {
  var LocationFile = sequelize.define('LocationFile', {
    url: DataTypes.STRING
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return LocationFile;
};