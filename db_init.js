const fs = require('fs');
const config = require('./config');
const sqlite3 = require('sqlite3');

const userDBExists = fs.existsSync(config.USER_IDENTITY_DB_FILE_PATH);

const db = new sqlite3.Database(config.USER_IDENTITY_DB_FILE_PATH);

if(!userDBExists){
    db.run("CREATE TABLE Users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT); COMMIT;");
    
}

module.exports = {db}