var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
var Database = require('../db/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pharmer', user: 'User' });
});

router.get('/database', function(req, res, next) {
  res.render('database', { title: 'Pharmer-Database', user: 'User', csrfToken: req.csrfToken()});
});

router.post('/database', upload.array('gene_data_file', 3), function(req, res, next) {
  var database = new Database('DRG', req.body['dbName']);
  var files = req.files;
  var descriptions, cell_values, go_terms;
  files.forEach((value, index) => {
    console.log(value['path']);
    if (value['originalname'] === "gene_descriptions.csv") {
      descriptions = value['path'];
    } else if (value['originalname'] === "gene_cell_csv.csv") {
      cell_values = value['path'];
    } else if (value['originalname'] === "go_terms.csv") {
      go_terms = value['path'];
    }
  });
  database.createCollection(req.body['dbName'], descriptions, cell_values, go_terms);
  res.json({'status': 'received'});
});

router.get('/database/list', function(req, res, next) {
  var database = new Database('DRG');
  database.getCollectionsList().then((result) => {
    res.json(result)
  }).catch((err) => {console.error(err);   res.json({'stauts': 'failed'});});
});

router.post('/database/fields', upload.none(), function(req, res, next) {
  var database = new Database('DRG');
  database.getCollectionFields(req.body['database']).then((result) => {
    console.log(result);
    res.json(result);
  }).catch((err) => {console.error(err); res.json({'status': 'failed'});});
});

module.exports = router;