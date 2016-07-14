var express = require('express');
var router = express.Router();
var models = require('../../models');

/* Manage location files. */
router.get('/', function(req, res, next) {
  models.LocationFile.findAll().then(locationFiles => {
    res.render('admin/location_files', {
      title: 'Theme Template for Bootstrap',
      locationFiles: locationFiles,
    });
  });
});

/* GET - Add new location file. */
router.get('/new', (req, res, next) => {
  res.render('admin/location_files_add');
});

/* POST - Add new location file. */
router.post('/create', (req, res, next) => {
  models.LocationFile.create({
    url: req.body.location_file_url
  }).then( () => {
    res.redirect('/admin/location-files');
  });
});

/* GET - Edit new location file. */
router.get('/:id/edit', (req, res, next) => {
  models.LocationFile.findById(req.params.id).then(locationFile => {
    res.render('admin/location_files_edit', {
      title: 'Theme Template for Bootstrap',
      locationFile: locationFile,
    });
  });
});

/* POST - Update location file. */
router.post('/:id/update', (req, res, next) => {
  models.LocationFile.update({
    url: req.body.location_file_url
  }, {
    where: { id: req.params.id }
  }).then( () => {
    res.redirect('/admin/location-files');
  });
});

/* DELETE - Destroy location file. */
router.post('/:id/destroy', (req, res, next) => {
  models.LocationFile.destroy({
    where: { id: req.params.id }
  }).then( () => {
    res.redirect('/admin/location-files');
  });
});

module.exports = router;
