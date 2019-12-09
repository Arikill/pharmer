const sqlite3 = require('sqlite3').verbose();

function database () {
    this.path = '../database/transcriptome';
};

database.prototype.connect = () => {
    this.db = new sqlite3.Database(this.path, sqlite3.OPEN_CREATE,(err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to in-memory SQlite database");
    });
}

database.prototype.disconnect = () => {
    this.db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Disconnected to in-memory SQlite database");
    });
}

database.prototype.connectToModify = () => {
    this.db = new sqlite3.Database(this.path, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to database for read and write");
    });
}