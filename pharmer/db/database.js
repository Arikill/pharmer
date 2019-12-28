const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');
const csv = require('csv-parser');

var database = function (database_name) {
    this.url = 'mongodb://localhost:27017/' + database_name;
    this.dbName = database_name;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
}

database.prototype.connect = function () {
    this.client.connect(function (err, client) {
        assert.equal(err, null);
        console.log("Connected successfully to server");
        client.close();
    });
}

database.prototype.getCollectionsList = function() {
    var promise = new Promise((resolve, reject) => {
        this.client.connect((err, client) => {
            if (err) reject(err);
            const db = client.db(this.dbName);
            db.listCollections().toArray((err, result) => {
                client.close();
                if (err) reject(err);
                resolve(result);
            });
        });
    });
    return promise;
}

database.prototype.getCollectionFields = function(collection_name) {
    var promise = new Promise((resolve, reject) => {
        this.client.connect((err, client) => {
            if (err) reject(err);
            const db = client.db(this.dbName);
            const collection = db.collection(collection_name);
            collection.findOne({}, (err, result) => {
                client.close();
                if (err) reject(err);
                resolve(result);
            });
        });
    });
    return promise;
}

database.prototype.getList = function (collection_name) {
    var promise = new Promise((resolve, reject) => {
        this.client.connect((err, client) => {
            assert.equal(err, null);
            console.log("connected");
            const db = client.db(this.dbName);
            const collection = db.collection(collection_name);
            collection.find({}).toArray((err, result) => {
                client.close();
                if (err) reject(err);
                resolve(err);
            });
        });
    });
    return promise;
}

database.prototype.insertGenes = function (collection_name, file) {
    var promise = new Promise((resolve, reject) => {
        this.client.connect((err, client) => {
            assert.equal(err, null);
            console.log("Connected");
            const db = client.db(this.dbName);
            const collection = db.collection(collection_name);
            var data = new Array(0);
            fs.createReadStream(file).pipe(csv())
                .on('data', (row) => {
                    var gene = {};
                    gene['_id'] = row['Gene.stable.ID'];
                    gene['transcript_id'] = row['Transcript.stable.ID'];
                    gene['name'] = row['Gene.name'];
                    gene['description'] = row['description'];
                    data.push(gene);
                }).on('end', () => {
                    console.log('Inserting gene descriptions');
                    collection.insertMany(data, (err, result) => {
                        assert.equal(err, null);
                        resolve(client);
                    });
                }).on('error', (error) => {
                    console.log(error);
                    reject(client.close());
                });
        });
    });
    return promise;
}

database.prototype.updateCellValues = function (client, collection_name, file) {
    var promise = new Promise((resolve, reject) => {
        const db = client.db(this.dbName);
        const collection = db.collection(collection_name);
        fs.createReadStream(file).pipe(csv())
            .on('data', (row) => {
                var id = row['Gene.stable.ID'];
                delete row['Gene.stable.ID'];
                console.log('Updating cell values: ', id);
                collection.findOneAndUpdate({ '_id': id }, { $set: row }, {
                    returnOriginal: true
                }, (err, result) => {
                    assert.equal(err, null);
                });
            }).on('end', () => {
                resolve(client);
            }).on('error', (error) => {
                console.error(error);
                reject(client.close());
            });
    });
    return promise;
}

database.prototype.updateGoTerms = function (client, collection_name, file) {
    var promise = new Promise((resolve, reject) => {
        const db = client.db(this.dbName);
        const collection = db.collection(collection_name);
        fs.createReadStream(file).pipe(csv())
            .on('data', function (row) {
                if (row['GO.term.name'] !== "") {
                    console.log('Updating go terms for:', row['Gene.stable.ID']);
                    collection.findOneAndUpdate({ '_id': row['Gene.stable.ID'] }, { $push: { 'goTerms': row['GO.term.name'] } }, {
                        returnOriginal: true
                    }, (err, result) => {
                        assert.equal(err, null);
                    });
                }
            }).on('end', function () {
                resolve(client);
            }).on('error', (error) => {
                console.error(error);
                reject(client.close());
            });
    });
    return promise;
}

database.prototype.createCollection = function (collection_name, descriptions_file, cell_values_file, go_terms_file) {
    var promise = new Promise((resolve, reject) => {
        this.insertGenes(collection_name, descriptions_file).then((result) => {
            this.updateCellValues(result, collection_name, cell_values_file).then((result) => {
                this.updateGoTerms(result, collection_name, go_terms_file).then((result) => {
                    resolve(result.close());
                }).catch(()=>{console.log("Could not update go terms. Client closed!");})
            }).catch(()=>{console.log("Could not update cell values. Client closed.");})
        }).catch(()=>{console.log("Could not insert genes. Client closed!")})
    });
    return promise;
}

module.exports = database;