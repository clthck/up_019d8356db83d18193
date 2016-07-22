var express = require('express');
var router = express.Router();
var models = require('../models');
var request = require('request');
var jsonfile = require('jsonfile');
var arrayize = require('arrayize');

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

function authorizePage(req, res, next) {
  if (req.params.id) {
    req.user.getCustomData((err, customData) => {
      if (customData.locationFileIds == '-1') {
        next();
      } else {
        if (arrayize(customData.locationFileIds).indexOf(req.params.id) > -1) {
          next();
        } else {
          res.redirect('/');
        }
      }
    });
  } else {
    next();
  }
}

/* GET location page. */
router.get('/:id', authorizePage, function(req, res, next) {
  injectGroupName(req, res, () => {
    models.LocationFile.findById(req.params.id).then(locationFile => {
      var pageTitle = locationFile.url.match(/\/([^\/]+)$/)[1].replace(/\.json$/, '');

      request({
        url: locationFile.url,
        json: true,
      }, (err, response, body) => {
        if (!err && response.statusCode === 200) {
          pageTitle = body.SITECAMEL || pageTitle;
          res.render('page', { 
            title: 'Angler Spy - Image Curator',
            data: body,
            pageTitle: pageTitle,
          });
        }
      });
    });
  });
});

/* POST generate JSON file. */
router.post('/:id', (req, res, next) => {
  models.LocationFile.findById(req.params.id).then(locationFile => {
    request({
      url: locationFile.url,
      json: true,
    }, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        var imageData = body[req.body.imageKey],
            json = {
          USERNAME: req.user.username,
          URL: imageData.URL,
          PROFILE: imageData.PROFILE,
          PROFILECODE: imageData.PROFILECODE,
          TID: body.TID,
          RID: body.RID,
          NAME: body.NAME,
          LOCATION: body.LOCATION,
        },
            fileName = locationFile.url.match(/\/([^\/]+)$/)[1];
        jsonfile.writeFileSync(__dirname + '/../public/json_results/' + fileName.replace(/\.json$/, '_result.json'), json);
        res.status(200).send('success');
      }
    });
  });
});

module.exports = router;
