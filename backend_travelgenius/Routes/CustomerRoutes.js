/*  **********************************************************
                    Imports
    ********************************************************** */
const express = require("express");
const router = express.Router();
const {
    getCustomers, 
    createCustomer, 
    updateCustomer, 
    deactivateCustomer
} = require("../Controllers/CustomerController");


/*  **********************************************************
                    Routes
    ********************************************************** */
router.route('/:id').get(getCustomers);
router.route('/').post(createCustomer);
router.route('/').put(updateCustomer);
router.route('/:id').delete(deactivateCustomer);


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = router;