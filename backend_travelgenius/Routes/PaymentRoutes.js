/*  **********************************************************
                    Imports
    ********************************************************** */
const express = require("express");
const router = express.Router();
const {
    getPayment,
    createPayment, 
    updatePaymentStatus
} = require("../Controllers/PaymentController");


/*  **********************************************************
                    Routes
    ********************************************************** */
router.route('/:id').get(getPayment);
router.route('/').post(createPayment);
router.route('/').put(updatePaymentStatus);

/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = router;