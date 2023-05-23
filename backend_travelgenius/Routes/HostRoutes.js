/*  **********************************************************
                    Imports
    ********************************************************** */
const express = require("express");
const router = express.Router();
const {
    getHosts, 
    createHost, 
    updateHost, 
    deleteHost
} = require("../Controllers/HostController");


/*  **********************************************************
                    Routes
    ********************************************************** */
router.route('/:id').get(getHosts);
router.route('/').post(createHost);
router.route('/').put(updateHost);
router.route('/:id').delete(deleteHost);


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = router;