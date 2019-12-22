var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
var client = require('../db/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('base', { title: 'Express' });
});

router.get('/transcriptome/database/upload/geneDescriptions', (req, res, next) => {
  var database = new client();
  database.connect();
  res.render('geneDescriptionsUpload', {title: 'New Gene Descriptions data', csrfToken: req.csrfToken()});
});

router.post('/transcriptome/database/upload/geneDescriptions', upload.array('geneDescriptions', 1), (req, res, next) => {
  var database = new Database('pharming');
  database.createCollection('transcriptome');
  var file = req.files[0];
  // database.insertGenes('transcriptome', file);
  res.json({'status': 'received'});
});

router.get('/transcriptome/database/upload/cellValues', upload.array('cellValues', 1), (req, res, next) => {
  res.render('cellValuesUpload', {title: 'Cell Values data', csrfToken: req.csrfToken()});
})

router.post('/transcriptome/database/upload/cellValues', upload.array('cellValues', 1), (req, res, next) => {
  var updateCellValuesPromise = new Promise((resolve, reject) => {
    var database = new Database();
    var file = req.files[0];
    resolve(database.updateCellValues(file["path"]));
  });
  updateCellValuesPromise.then(
    result => res.json({"status": "done"}),
    error => {console.log(error); res.json({"status": "failed"})}
  );
});

router.get('/transcriptome/database/upload/geneGoTerms', upload.array('geneGoTerms', 1), (req, res, next) => {
  res.render('geneGoTermsUpload', {title: 'Gene GoTerms Data', csrfToken: req.csrfToken()});
})

router.post('/transcriptome/database/upload/geneGoTerms', upload.array('geneGoTerms', 1), (req, res, next) => {
  var updateGeneGoTerms = new Promise((resolve, reject) => {
    var database = new Database();
    var file = req.files[0];
    resolve(database.updateGeneGoTerms(file["path"]));
  });
  updateGeneGoTerms.then(
    result => res.json({"status": "done"}),
    error => {console.log(error); res.json({"status": "failed"})}
  );
});

module.exports = router;