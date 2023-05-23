/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getCustomerByIdService,
        AddCustomerService,
        UpdateCustomerService,
        DeactivateCustomerService
    } = require("../Services/CustomerService");
    
const { param, body, validationResult } = require('express-validator');

const NotFoundError = require("../Errors/NotFoundError");
const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");
const MissingFieldsError = require("../Errors/MissingFieldsError");
const InvalidDataFormatError = require("../Errors/InvalidDataFormatError");
const { passwordPattern } = require("../Helpers/CommonData");


/*  **********************************************************
                    Controllers
    ********************************************************** */
// @desc Get customer
// @route GET /api/customer/:id
// @access public
const getCustomers = async (req, res) => {
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
        const customer = await getCustomerByIdService(req.params.id);
        res.status(200).json({message: "Found Successfully", customer: customer});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};

// @desc Create a new customer
// @route POST /api/customer
// @access public
const createCustomer = async (req, res) => {
    // Input checking
    await Promise.all([
        body('userName').exists().withMessage('userName is Mandatory')
            .isString().withMessage('userName must be an string').run(req),
        body('userEmail').exists().withMessage('userEmail is Mandatory')
            .isEmail().withMessage('Invalid Email Id').run(req),
        body('password').exists().withMessage('password is Mandatory')
            .isString().withMessage('password must be an string')
            .matches(passwordPattern).withMessage('password requirements not met').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        const result = await AddCustomerService(req.body);
        res.status(200).json({message: "Insert Sucessful", userId: result});
    } catch (err) {
        if (err instanceof ItemAlreadyExistsError
                ||  err instanceof MissingFieldsError) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// @desc Update a customer
// @route PUT /api/customer/
// @access public
const updateCustomer = async (req, res) => {
    // Input checking
    await Promise.all([
        body('userId').exists().withMessage('userId is Mandatory')
        .isInt().withMessage('userId must be an integer').run(req),
        body('userName').exists().withMessage('userName is Mandatory')
            .isString().withMessage('userName must be an string').run(req),
        body('userEmail').exists().withMessage('userEmail is Mandatory')
            .isEmail().withMessage('Invalid Email Id').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        await UpdateCustomerService(req.body);
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


// @desc Delete a customer
// @route DELETE /api/customer/:id
// @access public
const deactivateCustomer = async (req, res) => {
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
        await DeactivateCustomerService(req.params.id);
        res.status(200).json({message: "Deactivation Sucessful"});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else if (err instanceof ItemAlreadyExistsError) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports =  {
    getCustomers, 
    createCustomer, 
    updateCustomer,
    deactivateCustomer
};

