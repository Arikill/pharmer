const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');
const csv = require('csv-parser');

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

database.prototype.insertGenes = function(collectionName, geneDescriptionFile) {
    this.client.connect(function(err, client) {
        assert.equal(err, null);
        console.log("Connected successfully, ready to insert");
        const db = client.db(this.dbName);
        var data = [];
        fs.createReadStream(geneDescriptionFile).pipe(csv())
            .on('data', function(row) {
                var gene = {};
                gene['_id'] = row['Gene.stable.ID'];
                gene['transcript_id'] = row['Transcript.stable.ID'];
                gene['name'] = row['Gene.name'];
                gene['description'] = row['description'];
                data.push(gene);
            }).on('end', function() {
                db.collection(collectionName).insertMany(data, function(err, result) {
                    assert.equal(err, null);
                    console.log('Inserted genes: ', result.insertedCount);
                    client.close();
                });
            });
    });
}

database.prototype.insertCellValues = function(collectionName, cellValuesFile) {
    this.client.connect(function(err, client) {
        assert.equal(err, null);
        console.log("Connected successfully, ready to insert cell values");
        const db = client.db(this.dbName);
        
    });
}

module.exports = database;