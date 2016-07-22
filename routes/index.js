var express = require('express');
var router = express.Router();
var arrayize = require('arrayize');
var models = require('../models');

var injectGroupName = (req, res, callback) => {
  if (req.user == undefined) return;
  
  req.user.groupNames = [];
  req.user.getGroups((err, groups) => {
    if (err) return;
    groups.each((group, cb) => {
      req.user.groupNames.push(group.name);
      cb();
    }, (err) => {
      if (err) return;
      callback();
    });
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  injectGroupName(req, res, () => {
    var user = req.user;
    user.getCustomData((err, customData) => {
      var criteria = {};
      if (customData.locationFileIds != '-1') {
        criteria = {
          where: {
            id: { 'in': arrayize(customData.locationFileIds) }
          }
        };
      }
      models.LocationFile.findAll(criteria).then(locationFiles => {
        res.render('index', { 
          title: 'Angler Spy Image Curator',
          locationFiles: locationFiles,
        });
      });
    });
  });
});

module.exports = router;
