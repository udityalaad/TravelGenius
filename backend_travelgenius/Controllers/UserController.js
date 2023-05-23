/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        authenticateUserService
    } = require("../Services/UserService");

const NotFoundError = require("../Errors/NotFoundError");


/*  **********************************************************
                    Controllers
    ********************************************************** */
// @desc Get authenticateUser
// @route GET /api/authenticateUser/:id/:password
// @access public
const authenticateUser = async (req, res) => {
    // Action
    try {
        const userId = await authenticateUserService(req.params.id, req.params.password);
        res.status(200).json({message: "User Authentication Successfull", userId: userId});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(401).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports =  {
    authenticateUser
};

