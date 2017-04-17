module.exports = {
    CREATE_TABLE: `
        CREATE TABLE businesses (
            id UNSIGNED INTEGER PRIMARY KEY,
            uuid CHAR(36),
            name VARCHAR(255),
            address VARCHAR(255),
            address2 VARCHAR(255),
            city VARCHAR(255),
            state CHAR(2),
            zip CHAR(5),
            country CHAR(2),
            phone VARCHAR(10),
            website VARCHAR(255),
            created_at DATETIME
        );`,

    INSERT_BUSINESS: `
        INSERT INTO businesses (
            id,
            uuid,
            name,
            address,
            address2,
            city,
            state,
            zip,
            country,
            phone,
            website,
            created_at
        ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        );`
};