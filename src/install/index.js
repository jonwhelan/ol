const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const parseCsv = Promise.promisify(require('csv-parse'));
const sqlite3 = require('sqlite3');
const sql = require('./sql');
const dbDir = path.resolve(__dirname, '../../db');
const dataFilePath = path.resolve(__dirname, '../../resources/engineering_project_businesses.csv');
const mkdir = Promise.promisify(fs.mkdir);

const dbh = mkdir(dbDir, 0o755)
    .catch((err) => {
        if (err.code === 'EEXIST') {
            return;
        }
        throw new Error(`Error creating data directory at: ${dbDir}`);
    }).
    then(() => {
        const conn = new sqlite3.Database('./db/data.sqlite3');
        return Promise.promisify(conn.run, {context: conn});
    });

const createBusinessesTable = dbh.then((runQuery) => {
    return runQuery(sql.CREATE_TABLE);
}).then(() => {
    return dbh;
}).catch(() => {
    return dbh;
});

createBusinessesTable.then((runQuery) => {
    return parseCsv(fs.readFileSync(dataFilePath))
        .then((records) => {

            console.log(`Importing ${records.length - 1} records`);

            records.forEach((values, i) => {
                if (i === 0) {
                    return;
                }
                runQuery(sql.INSERT_BUSINESS, values).then(() => {
                    console.log(`Inserted record ID: ${values[1]}`);
                }).catch(() => {
                    console.error('Unable to insert record');
                });
            });
        });
});
