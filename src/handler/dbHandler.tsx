const pg = require('pg');
const CONFIG = require('../config/dbConfig.tsx');
// Create a pool.
const pool = new pg.Pool(CONFIG);

module.exports = {
  selectAll: () => {
    return new Promise((resolve, reject) => {
      pool.query('select * from imagemeta;')
        .then(res => resolve(res.rows))
        .catch(err =>
          reject(err)
        );
    });
  },
  selectOne: (uuid) => {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM imagemeta WHERE uid='${uuid}';`)
        .then(res => resolve(res.rows))
        .catch(err =>
          reject(err)
        );
    });
  },
  insert: (uuid, name, message, date) => {
    console.log(`INSERT INTO imagemeta VALUES ('${uuid}', '${name}', '${message}', '${date.toString()}');`);
    return new Promise((resolve, reject) => {
      pool.query(`INSERT INTO imagemeta VALUES ('${uuid}', '${name}', '${message}', '${date.toString()}');`)
        .then(res => resolve(res))
        .catch(err => {
          console.log(err);
          reject(err)
        }
        );
    });
  },
  delete: (uuid) => {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM imagemeta WHERE uid='${uuid}';`)
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
