const fs = require('fs');
const {USER_IDENTITY_DB_FILE_PATH} = require('./config');
const sqlite3 = require('sqlite3');

const userDBExists = fs.existsSync(USER_IDENTITY_DB_FILE_PATH);

const db = new sqlite3.Database(USER_IDENTITY_DB_FILE_PATH);

if(!userDBExists){
    db.run("CREATE TABLE Users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT); COMMIT;");
    
}

module.exports = {db}