const app = require('express')();
const sqlite3 = require('sqlite3');
const R = require('ramda');
const Promise = require('bluebird');
const dbh = new sqlite3.Database('./db/data.sqlite3');
const runQuery = Promise.promisify(dbh.all, {context: dbh});
const DEFAULT_RESULTS_PER_PAGE = 50;
const bodyParser = require('body-parser');

function isPositiveInteger(a) {
    const parsed = parseInt(a, 10);
    return parsed == a && parsed > 0;
}

app.use(bodyParser.json());

app.get('/businesses', (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || DEFAULT_RESULTS_PER_PAGE;

    if (!isPositiveInteger(page)) {
        return res.status(400).json({
            message: 'Page number must be a positive integer'
        });
    }

    if (!isPositiveInteger(limit)) {
        return res.status(400).json({
            message: 'Limit must be a positive integer'
        });
    }

    const businesses = runQuery('SELECT * FROM businesses ORDER BY id ASC LIMIT ?, ?', [
        (page - 1) * limit,
        limit
    ]);

    const count = runQuery('SELECT COUNT(*) as `count` FROM businesses').then(R.path([0, 'count']));

    Promise.all([businesses, count]).spread((businessRecords, total) => {
        res.json({
            pagination: {
                total: total
            },
            businesses: businessRecords
        });
    }).catch(() => {
        res.status(500).json({
            message: 'An unexpected error occurred. Please try again.'
        });
    });
});

app.get('/businesses/:id', (req, res) => {
    dbh.get('SELECT * FROM businesses WHERE id = ?', req.params.id, (err, record) => {
        if (err) {
            return res.status(500).json({
                message: 'An unexpected error occurred. Please try again.'
            });
        }

        if (!record) {
            return res.status(404).json({
                message: 'Business not found.'
            });
        }

        res.json(record);
    });
});

/**
 * Endpoint to update name, address and/or phone number of business
 */
app.put('/businesses/:id', (req, res) => {
    if (req.body === undefined) {
        return res.status(400).end();
    }

    if (!R.intersection(Object.keys(req.body), ['name', 'address', 'phone']).length) {
        return res.status(400).send({
            message: 'Only `name`, `address`, and `phone` keys are allowed'
        });
    }

    const fields = Object.keys(req.body).map((name) => {
        return `${name}=?`;
    }).join(', ');

    dbh.run(`UPDATE businesses SET ${fields}`, R.values(req.body), (err, a) => {
        res.status(200).end();
    });
});

app.listen(3000);

module.exports = app;
