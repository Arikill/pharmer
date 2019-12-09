var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
var Reader = require('../libs/reader');
var Database = require('../libs/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('base', { title: 'Express' });
});

router.get('/pca', (req, res, next) => {
  var database = new Database();
  database.connectionTest();
  res.render('pca', {title: 'PCA Pharmer', csrfToken: req.csrfToken()});
});

router.post('/pca', upload.array('transcriptome', 3), (req, res, next) => {
  var reader = new Reader();
  req.files.forEach((value, index) => {
    if (value.originalname === "gene_cell.csv") {
      var file = value.path;
      reader.readGeneCell(file);
    }
  });
  res.json({"status": req.body});
});

module.exports = router;