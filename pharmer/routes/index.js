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
  var database = new Database('DRG');
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
  // console.log(req.body['dbName'], descriptions, cell_values, go_terms);
  database.createNewCollection(req.body['dbName'], descriptions, cell_values, go_terms);
  res.json({'status': 'received'});
});

router.get('/transcriptome/database/upload/geneDescriptions', (req, res, next) => {
  var database = new Database();
  database.connect();
  res.render('geneDescriptionsUpload', {title: 'New Gene Descriptions data', csrfToken: req.csrfToken()});
});

router.post('/transcriptome/database/upload/geneDescriptions', upload.array('geneDescriptions', 1), (req, res, next) => {
  var database = new Database();
  var file = req.files[0]["path"];
  database.insertGenes('genes', file);
  res.json({'status': 'received'});
});

router.get('/transcriptome/database/upload/cellValues', upload.array('cellValues', 1), (req, res, next) => {
  res.render('cellValuesUpload', {title: 'Cell Values data', csrfToken: req.csrfToken()});
})

router.post('/transcriptome/database/upload/cellValues', upload.array('cellValues', 1), (req, res, next) => {
  var database = new Database();
  var file = req.files[0]['path'];
  database.updateCellValues('genes', file);
  res.json({'status': 'received'});
});

router.get('/transcriptome/database/upload/geneGoTerms', upload.array('geneGoTerms', 1), (req, res, next) => {
  res.render('geneGoTermsUpload', {title: 'Gene GoTerms Data', csrfToken: req.csrfToken()});
});

router.post('/transcriptome/database/upload/geneGoTerms', upload.array('geneGoTerms', 1), (req, res, next) => {
  var database = new Database();
  var file = req.files[0]['path'];
  database.updateGoTerms('genes', file);
  res.json({'status': 'received'});
});

module.exports = router;