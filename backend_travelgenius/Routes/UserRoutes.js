/*  **********************************************************
                    Imports
    ********************************************************** */
const express = require("express");
const router = express.Router();
const {
    authenticateUser
} = require("../Controllers/UserController");


/*  **********************************************************
                    Routes
    ********************************************************** */
router.route('/authenticateUser/:id/:password').get(authenticateUser);
/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = router;