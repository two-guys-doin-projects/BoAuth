import fs from 'fs'
import {USER_IDENTITY_DB_FILE_PATH} from './config.js'
import sqlite3 from 'sqlite3'

const userDBExists = fs.existsSync(USER_IDENTITY_DB_FILE_PATH);

const db = new sqlite3.Database(USER_IDENTITY_DB_FILE_PATH);

if(!userDBExists){
    db.run("CREATE TABLE Users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT); COMMIT;");
    
}

export default db