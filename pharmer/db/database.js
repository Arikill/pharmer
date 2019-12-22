const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');

var database = function () {
    this.url = 'mongodb://localhost:27017';
    this.dbName = 'pharming';
    this.client = new MongoClient(this.url)
}


module.exports = database;