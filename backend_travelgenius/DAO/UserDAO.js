/*  **********************************************************
                    Imports
    ********************************************************** */
const {
    implementReadQuery,
    implementWriteQuery,
    implementStoredProcedure
} = require("../Config/dbConnection");

/*  **********************************************************
                    DAO Implementation
    ********************************************************** */
// 1. Get User By Id & Password
const getUserByIdAndPasswordDAO = async (userId, password) => {
    var sqlQuery = `SELECT * FROM UserAccount
                    WHERE userId = '${userId}'  AND  password = '${password}'`;
    var result = await implementReadQuery(sqlQuery)

    return result;
}

// 2. Get User By Email & Password
const getUserByEmailAndPasswordDAO = async (userEmail, password) => {
    var sqlQuery = `SELECT * FROM UserAccount
                    WHERE userEmail = '${userEmail}'  AND  password = '${password}'`;
    var result = await implementReadQuery(sqlQuery)

    return result;
}

/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getUserByIdAndPasswordDAO,
    getUserByEmailAndPasswordDAO
};

