const {db} = require('./db_init');

const validateUser = async (login, password) => {
    // retrieves user identity from database.
    var fetched_user = null;
    db.get("SELECT * from Users WHERE username = $login", {$login: login}, (err, usr) => {
        fetched_user = usr;
    })
    const userNotExists = fetched_user === null
    const invalidPassword = fetched_user.password != password
    if(userNotExists || invalidPassword){
        return null;
    }
    return fetched_user;
}

const registerUser = async (login, password) => {
    db.run("INSERT INTO Users (username, password) VALUES(?)", [login, password], (err) => {
        if(err){
            throw new Error(err)
        }
    })
    return validateUser(login, password)
}

// close database connection on application exit
process.on('exit', () => {
    db.close();
})

module.exports = {
    validateUser
}