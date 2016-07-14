var express = require('express');
var router = express.Router();
var models = require('../../models');
var _ = require('underscore');

/* GET admin dashboard. */
router.get('/', function(req, res, next) {
  var stormpathApp = req.app.get('stormpathApplication'),
      users = [];
  stormpathApp.getAccounts((err, accounts) => {
    accounts.each((account, cb) => {
      account.getCustomData((err, customData) => {
        account.customData = _.extend(account.customData, customData);
        users.push(account);
        cb();
      });
    },
    (err) => {
      models.LocationFile.findAll().then(locationFiles => {
        res.render('admin/index', {
          title: 'Theme Template for Bootstrap',
          users: users, 
          locationFiles: locationFiles,
        });
      });
    });
  });
});

/* POST update user permissions */
router.post('/', (req, res, next) => {
  var stormpathApp = req.app.get('stormpathApplication'),
      locationFileIds = req.body.user.locationFileIds;
  stormpathApp.getAccounts((err, accounts) => {
    accounts.each((account, cb) => {
      account.customData.locationFileIds = locationFileIds[account.username];
      account.customData.save();
      cb();
    },
    (err) => {
      res.redirect('/admin');
    });
  });
});

module.exports = router;
