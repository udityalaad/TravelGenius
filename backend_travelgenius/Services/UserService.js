/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getUserByIdAndPasswordDAO,
        getUserByEmailAndPasswordDAO
    } = require("../DAO/UserDAO");
const NotFoundError = require("../Errors/NotFoundError");
const { emailPattern } = require('../Helpers/CommonData');
const bigInt = require('big-integer');

/*  **********************************************************
                    Services
    ********************************************************** */
// 1. Get User By Id
const authenticateUserService = async (id, password) => {
    var user = null;

    if (id.match(emailPattern)) {
        user = await getUserByEmailAndPasswordDAO(id, password);
    } else {
        user = await getUserByIdAndPasswordDAO(id, password);
    }

    if (user.length == 0) {
        throw new NotFoundError(`User authentication failed.`);
    }

    return String(bigInt(user[0].userId));
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    authenticateUserService
}

