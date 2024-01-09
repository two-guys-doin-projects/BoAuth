import db from './db_init.js'

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
    return new Promise((resolve, reject) => {
        try {
            validateLoginParameters(login, password);

            db.get("SELECT * FROM Users WHERE username = $login", { $login: login }, (err, usr) => {
                if (err) {
                    reject(new Error("Error fetching user: " + err.message));
                }

                if (!usr) {
                    console.log("Fail to fetch user: user does not exist.");
                    resolve(null);
                }
                try {
                    const invalidPassword = usr.password !== password;
                    if (invalidPassword) {
                    console.log("Fail to auth: incorrect password.");
                    resolve(null);
                    }
                }
                catch(err){
                }
                resolve(usr);
            });
        } catch (err) {
            reject(new Error("Error validating user: " + err.message));
        }
    });
};

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
    return new Promise((resolve, reject) => {

        db.get("SELECT * FROM Users WHERE id = $id", { $id: id }, (err, user) => {
            if (err) {
                reject(new Error("Error fetching user: " + err.message));
            }
            resolve(user);
        });
    });
};

// close database connection on application exit
process.on('exit', () => {
    db.close();
})

export default {validateUser, registerUser, getUserByID}