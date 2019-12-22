const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');

var database = function () {
    this.url = 'mongodb://localhost:27017';
    this.dbName = 'pharming';
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
}

database.prototype.connect = function() {
    this.client.connect(function(err, client) {
        assert.equal(err, null);
        console.log("Connected successfully to server");
        client.close();
    });
}

database.prototype.createCollection = function(collectionName) {
    this.client.connect(function(err, client) {
        assert.equal(err, null);
        console.log("Connected successfully to server");
        const db = client.db(this.dbName);
        db.createCollection(collectionName, {}, function(err, results) {
            console.log("Collection created!", collectionName);
            client.close();
        });
    });
}



module.exports = database;