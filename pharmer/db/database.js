var csv = require("csv-parser");
var fs = require("fs");
const { Pool } = require('pg');

var Database = function() {
    this.pool = new Pool({
        user: 'transcriptome',
        host: 'localhost',
        database: 'transcriptome',
        password: 'TranscriptPharmer#46',
        port: 8100
    });
}

Database.prototype.connect = function() {
    this.pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        return 'Connected to Database';
    });
}

Database.prototype.disconnect = function() {
    this.pool.end((err) => {
        if (err) {
            return console.log('Unable to disconnect client', err.stack);
        }
    });
    return console.log('Disconnected from database.');
}

Database.prototype.test = function(){
    this.pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        console.log("Connection test: successful");
        this.pool.end();
        console.log("End test: Connection closed!");
    });
}

Database.prototype.createTables = function() {
    const createGeneQuery = `CREATE TABLE IF NOT EXISTS 
                        genes(
                            id SERIAL PRIMARY KEY UNIQUE,
                            geneID TEXT UNIQUE,
                            transcriptID TEXT UNIQUE,
                            name TEXT,
                            description TEXT,
                            Nonpeptidergic_Nociceptor_1 NUMERIC,
                            Nonpeptidergic_Nociceptor_2 NUMERIC,
                            Nonpeptidergic_Nociceptor_3 NUMERIC,
                            Peptidergic_Nociceptor_1 NUMERIC,
                            Peptidergic_Nociceptor_2 NUMERIC,
                            Peptidergic_Nociceptor_3 NUMERIC,
                            C_LTMR_1 NUMERIC,
                            C_LTMR_2 NUMERIC,
                            C_LTMR_3 NUMERIC,
                            A_delta_LTMR_1 NUMERIC,
                            A_delta_LTMR_2 NUMERIC,
                            A_delta_LTMR_3 NUMERIC,
                            A_beta_RA_LTMR_1 NUMERIC,
                            A_beta_RA_LTMR_2 NUMERIC,
                            A_beta_RA_LTMR_3 NUMERIC,
                            A_beta_RA_LTMR_4 NUMERIC,
                            A_beta_RA_LTMR_5 NUMERIC,
                            A_beta_SA1_LTMR_1 NUMERIC,
                            A_beta_SA1_LTMR_2 NUMERIC,
                            A_beta_SA1_LTMR_3 NUMERIC,
                            A_beta_FIELD_LTMR_1 NUMERIC,
                            A_beta_FIELD_LTMR_2 NUMERIC,
                            A_beta_FIELD_LTMR_3 NUMERIC,
                            Proprioceptor_1 NUMERIC,
                            Proprioceptor_2 NUMERIC,
                            Proprioceptor_3 NUMERIC
                        )`;
    const createCellQuery = `CREATE TABLE IF NOT EXISTS 
                        cells(
                            id SERIAL PRIMARY KEY UNIQUE,
                            cell TEXT UNIQUE,
                            description TEXT
                        )`;
    const createGeneCellQuery = `CREATE TABLE IF NOT EXISTS 
                        cells_genes(
                            cell_id SERIAL REFERENCES cells (id) ON UPDATE CASCADE ON DELETE CASCADE,
                            gene_id SERIAL REFERENCES genes (id) ON UPDATE CASCADE ON DELETE CASCADE,
                            value NUMERIC NOT NULL DEFAULT 0,
                            CONSTRAINT cells_genes_pkey PRIMARY KEY (cell_id, gene_id)
                        )`;
    this.pool.connect((err, client) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query(createGeneQuery).then((res) => {
            console.log(res); console.log("Created Gene Table.");
            client.query(createCellQuery).then((res) => {
                console.log(res); console.log("Created Cell Table.");
                client.query(createGeneCellQuery).then((res) => {
                    console.log(res); console.log("Created GeneCell Table.");
                    client.release();
                }).catch((err)=>{console.error(err);console.log(err.stack);client.release();});
            }).catch((err)=>{console.error(err);console.log(err.stack);client.release();});
        }).catch((err)=>{console.error(err);console.log(err.stack);client.release();});;
    });
}

Database.prototype.insertGene = function (genesFile) {
    this.pool.connect((err, client) => {
        if (err) {
            console.error('Error acquiring client', err.stack);
            return
        }
        client.query('BEGIN', err => {
            if (err) {
                console.error(err);
                console.log("Error with begin write: ", err.stack);
                return;
            }
            fs.createReadStream(genesFile).pipe(csv())
                .on('data', (row) => {
                    const insertGeneText = 'INSERT INTO genes(geneID, transcriptID, name, description) VALUES($1, $2, $3, $4) RETURNING id';
                    const insertGeneValues = [row["Gene.stable.ID"], row["Transcript.stable.ID"], row["Gene.name"], row["description"]];
                    client.query(insertGeneText, insertGeneValues, (err, res) => {
                        if (err) {
                            console.error(err);
                            console.log("Error with insert: ", err.stack);
                        }
                        console.log("Inserted: ", insertGeneValues);
                    });
                }).on('end', () => {
                    client.query('COMMIT', err => {
                        if (err) {
                            console.error(err);
                            console.log('Error committing transaction', err.stack);
                            client.query('ROLLBACK', err => {
                                if (err) {
                                    console.error(err);
                                    console.log('Error rolling back', err.stack);
                                }
                                client.release();
                                return
                            });
                        }
                        client.release();
                    });
                });
        });
    });
}


module.exports = Database;