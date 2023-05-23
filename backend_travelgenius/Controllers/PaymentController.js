/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getPaymentByIdService,
        AddPaymentService,
        UpdatePaymentStatusService
    } = require("../Services/PaymentService");

const { param, body, validationResult } = require('express-validator');
const { isURL } = require('validator');

const NotFoundError = require("../Errors/NotFoundError");
const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");
const MissingFieldsError = require("../Errors/MissingFieldsError");
const InvalidDataFormatError = require("../Errors/InvalidDataFormatError");


/*  **********************************************************
                    Controllers
    ********************************************************** */
// @desc Get payment
// @route GET /api/paymentgetPayment/:id
// @access public
const getPayment = async (req, res) => {
    // Input checking
    await Promise.all([
        param('id').isInt().withMessage('id must be an integer').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        const payment = await getPaymentByIdService(req.params.id);
        res.status(200).json({message: "Found Successfully", payment: payment});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};

// @desc Create a new payment
// @route POST /api/payment
// @access public
const createPayment = async (req, res) => {
    // Input checking
    await Promise.all([
        body('interacId').exists().withMessage('interacId is Mandatory')
            .isEmail().withMessage('Invalid interacId').run(req),
        body('paymentStatus').exists().withMessage('paymentStatus is Mandatory')
            .isString().withMessage('paymentStatus must be a string').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        const result = await AddPaymentService(req.body);
        res.status(200).json({message: "Insert Sucessful", paymentId: result});
    } catch (err) {
        if (err instanceof ItemAlreadyExistsError
                ||  err instanceof MissingFieldsError
                ||  err instanceof InvalidDataFormatError) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// @desc Update a payment
// @route PUT /api/payment/
// @access public
const updatePaymentStatus = async (req, res) => {
    // Input checking
    await Promise.all([
        body('paymentId').exists().withMessage('paymentId is Mandatory')
            .isInt().withMessage('paymentId must be an integer').run(req),
        body('paymentStatus').exists().withMessage('paymentStatus is Mandatory')
            .isString().withMessage('paymentStatus must be a string').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        await UpdatePaymentStatusService(req.body);
        res.status(200).json({message: "Update Sucessful"});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else if (err instanceof MissingFieldsError
                ||  err instanceof InvalidDataFormatError
                ||  err instanceof ItemAlreadyExistsError) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// // @desc Delete a payment
// // @route DELETE /api/payment/:id
// // @access public
// const deactivatePayment = async (req, res) => {
//     try {
//         await DeactivatePaymentService(req.params.id);
//         res.status(200).json({message: "Deactivation Sucessful"});
//     } catch (err) {
//         if (err instanceof NotFoundError) {
//             res.status(404).json({message: err.message});
//         } else {
//             res.status(500).json({message: err.message});
//         }
//     }
// };


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports =  {
    getPayment,
    createPayment, 
    updatePaymentStatus
};

