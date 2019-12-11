var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
var Reader = require('../libs/reader');
var Database = require('../db/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('base', { title: 'Express' });
});

router.get('/transcriptome/newdata', (req, res, next) => {
  var database = new Database();
  database.test();
  database.createTables();
  res.render('transcriptome', {title: 'New Transcriptome data', csrfToken: req.csrfToken()});
});

router.post('/transcriptome/newdata', upload.array('transcriptome', 3), (req, res, next) => {
  var database = new Database();
  req.files.forEach((value, index) => {
    if(value.originalname == "gene_descriptions.csv") {
      database.insertGene(value.path);
    }
  });
  // var reader = new Reader();
  // req.files.forEach((value, index) => {
  //   if (value.originalname === "gene_cell.csv") {
  //     var file = value.path;
  //     reader.readGeneCell(file);
  //   }
  // });
  res.json({"status": req.body});
});


module.exports = router;