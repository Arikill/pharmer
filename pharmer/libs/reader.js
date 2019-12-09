var csv = require("csv-parser");
var fs = require("fs");

function reader() {};

reader.prototype.readGeneCell = function(geneCellFile) {
    this.data = new Array(0);
    fs.createReadStream(geneCellFile).pipe(csv())
        .on('data', (row) => {
            this.data.push(row);
        })
        .on('end', () => {
            console.log(this.data);
            console.log("done");
        });
    return this.data
}

module.exports = reader;