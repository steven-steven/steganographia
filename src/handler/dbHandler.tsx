const pg = require('pg');
const CONFIG = require('../config/dbConfig.tsx');
// Create a pool.
const pool = new pg.Pool(CONFIG);

new Promise((resolve, reject) => {
    pool.query(`DELETE FROM my_table WHERE uid=123;`)
        .then(res => resolve(res))
        .catch(err =>
            reject(err)
        );
}).then((res) => {
    console.log(res);
})
pool.end();

module.exports = {
    selectAll: () => {
        return new Promise((resolve, reject) => {
            pool.query('select * from my_table;')
                .then(res => resolve(res.rows))
                .catch(err =>
                    reject(err)
                );
        });
    },
    selectOne: (uuid) => {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM my_table WHERE uid=${uuid};`)
                .then(res => resolve(res.rows))
                .catch(err =>
                    reject(err)
                );
        });
    },
    insert: (uuid, name, message, date) => {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT INTO my_table VALUES (${uuid}, ${name}, ${message}, ${date.toString()});`)
                .then(res => resolve(res))
                .catch(err =>
                    reject(err)
                );
        });
    },
    delete: (uuid) => {
        return new Promise((resolve, reject) => {
            pool.query(`DELETE FROM my_table WHERE uid=${uuid};`)
                .then(res => resolve(res))
                .catch(err =>
                    reject(err)
                );
        });
    },
    shutdown: () => {
        pool.end();
    }
}
