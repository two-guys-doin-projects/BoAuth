const {db} = require('./db_init');

const validateLoginParameter = (parameter) => {
    //checks if passed login parameter is valid.
    invalidParameterPassed = parameter === null || parameter === '' || parameter.includes(' ');
    if(invalidParameterPassed){
        return false
    }
    return true
}

const validateLoginParameters = (login, password) => {
    if(!validateLoginParameter(login) || !validateLoginParameter(password)){
        throw new Error("Login parameters are invalid.")
    }
}

const validateUser = (login, password) => {
    try{
        validateLoginParameters(login, password)
    }catch(err){
        //return null;
        throw new Error("Error validating user:" + err.message);
    }
    // retrieves user identity from database.
    db.get("SELECT * from Users WHERE username = $login", {$login: login}, async (err, usr) => {
        if(err){
            throw new Error("Error fetching user:" + err.message)
        }
        console.log(usr);
        if(!usr){
            console.log("Fail to fetch user: user does not exist.")
            return null;
        }
        const invalidPassword = usr.password != password
        if(invalidPassword){
            console.log("Fail to auth: incorrect password.")
            return null;
        }
        return usr;
    })

}

const registerUser = (login, password) => {
    validateLoginParameters(login, password)
    db.run("INSERT INTO Users (username, password) VALUES(?)", [login, password], (err) => {
        if(err){
            throw new Error(err)
        }
    })
    return validateUser(login, password)
}

const getUserByID = (id) => {
    var fetched_user = null;
    db.get("SELECT * from Users WHERE id = $id", {$id: id}, (err, usr) => {
        fetched_user = usr;
    })
    return fetched_user
}

// close database connection on application exit
process.on('exit', () => {
    db.close();
})

module.exports = {
    validateUser,
    registerUser,
    getUserByID
}