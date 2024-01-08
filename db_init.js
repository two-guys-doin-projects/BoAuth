const fs = require('fs');
const {USER_IDENTITY_DB_FILE_PATH} = require('./config');
const sqlite3 = require('sqlite3');

const localDB = () => {
    const userDBExists = fs.existsSync(USER_IDENTITY_DB_FILE_PATH);

    const db = new sqlite3.Database(USER_IDENTITY_DB_FILE_PATH);
    
    if(!userDBExists){
        console.log(`Database file created at ${USER_IDENTITY_DB_FILE_PATH}; running migration...`)
        db.run("CREATE TABLE Users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT); COMMIT;");
    }
    return db
}

const db = localDB()

module.exports = {db}