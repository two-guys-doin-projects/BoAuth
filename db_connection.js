const sqlite3 = require('sqlite3');
const sqlite = require('sqlite')

(async () => {
    // open the database
    const db = await open({
      filename: 'users.db',
      driver: sqlite3.Database
    })
})()

const validateUser = async (login, password) => {
    // retrieves user identity from database.
    const user = await db.get(
        'SELECT ID, password, name, surname FROM Users WHERE login = ?',
        login)
    if(user.password != password){
        return null
    }
    delete user.password
    
}
