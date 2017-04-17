const app = require('express')();
const sqlite3 = require('sqlite3');
const dbh = new sqlite3.Database('./db/data.sqlite3');

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

app.listen(3000);

module.exports = app;
