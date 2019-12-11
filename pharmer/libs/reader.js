var csv = require("csv-parser");
var fs = require("fs");

function reader() {};

reader.prototype.writeToDB = function(files) {
    var gene_cell_file;
    this.gene_cell_data = new Array(0);
    var gene_descriptions_file;
    this.gene_descriptions = new Array(0);
    var go_terms_file;
    this.gene_go_terms = new Array(0);
    files.forEach((value) => {
        if (value.originalname == "gene_cell.csv") {
            gene_cell_file = value.path;
        } else if (value.originalname == "gene_descriptions.csv") {
            gene_descriptions_file = value.path;
        } else if (value.originalname == "go_terms.csv") {
            go_terms_file = value.path;
        }
    });
    fs.createReadStream(go_terms_file).pipe(csv())
        .on('data', (row) => {
            this.gene_go_terms.push(row);
        }).on('end', () => {
            
        });
}

reader.prototype.readGeneCell = function(geneCellFile) {
    this.GeneCellData = new Array(0);
    fs.createReadStream(geneCellFile).pipe(csv())
        .on('data', (row) => {
            this.GeneCellData.push(row);
        })
        .on('end', () => {
            console.log(this.data);
            console.log("done");
        });
    return this.GeneCellData
}

reader.prototype.readGene = function(geneFile) {
    this.GeneData = new Array(0);
    fs.createReadStream(geneFile).pipe(csv())
        .on('data', (row) => {
            this.GeneCellData.push(row);
        })
        .on('end', () => {
            console.log(this.data);
            console.log("done");
        });
    return this.GeneData
}

module.exports = reader;