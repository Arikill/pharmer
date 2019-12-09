const sqlite3 = require('sqlite3').verbose();

var database = function () {
    console.log(process.cwd());
    this.path = './database/transcriptome.db';
};

database.prototype.connect = function() {
    this.db = new sqlite3.Database(this.path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to transcriptome SQlite database");
    });
}

database.prototype.disconnect = function () {
    this.db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Disconnected to transcriptome SQlite database");
    });
}

database.prototype.connectToModify = function () {
    this.db = new sqlite3.Database(this.path, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to database for read and write");
    });
}

database.prototype.connectionTest = function() {
    console.log("Testing Database connection.");
    this.connect();
    this.disconnect();
}

database.prototype.createGeneTable = function() {
    this.db.run('CREATE TABLE IF NOT EXISTS genes(id INTEGER PRIMARY KEY AUTOINCREMENT, stableid TEXT, name TEXT, description TEXT)');
}

database.prototype.createCellTable = function () {
    this.db.run('CREATE TABLE IF NOT EXISTS cells(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)');
}

database.prototype.createGeneCellTable = function () {
    this.db.run('CREATE TABLE IF NOT EXISTS cells_genes(cell_gene_id INTEGER PRIMARY KEY AUTOINCREMENT, value INTEGER, cell_id INTEGER REFERENCES cells(id), gene_id INTEGER REFERENCES genes(id))');
}

module.exports = database;