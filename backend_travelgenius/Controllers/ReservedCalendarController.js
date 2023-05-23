/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getReservedCalendarByIdentifierService,
        getReservedCalendarsByListingService,
        getReservedCalendarsByCustomerService,
        AddReservedCalendarService
    } = require("../Services/ReservedCalendarService");

const { param, body, validationResult } = require('express-validator');
const { isURL } = require('validator');

const NotFoundError = require("../Errors/NotFoundError");
const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");
const MissingFieldsError = require("../Errors/MissingFieldsError");
const InvalidDataFormatError = require("../Errors/InvalidDataFormatError");
const RuleViolationError = require("../Errors/RuleViolationError");


/*  **********************************************************
                    Controllers
    ********************************************************** */
// @desc Get ReservedCalendarByIdentifier
// @route GET /api/reservedCalendar/reservedCalendarByIdentifier/:listingId/:date
// @access public
const getReservedCalendarByIdentifier = async (req, res) => {
    // Input checking
    await Promise.all([
        param('listingId').isInt().withMessage('listingId must be an integer').run(req),
        param('date').isDate().withMessage('date must be a DATE').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        const reservedCalendar = await getReservedCalendarByIdentifierService(req.params.listingId, req.params.date);
        res.status(200).json({message: "Found Successfully", reservedCalendar: reservedCalendar});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// @desc Get reservedCalendarsByListing
// @route GET /api/reservedCalendar/reservedCalendarsByListing/:listingId
// @access public
const getReservedCalendarsByListing = async (req, res) => {
    // Input checking
    await Promise.all([
        param('listingId').isInt().withMessage('listingId must be an integer').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        const reservedCalendars = await getReservedCalendarsByListingService(req.params.listingId);
        res.status(200).json({message: "Found Successfully", reservedCalendars: reservedCalendars});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// @desc Get reservedCalendarsByCustomer
// @route GET /api/reservedCalendar/reservedCalendarsByCustomer/:userId
// @access public
const getReservedCalendarsByCustomer = async (req, res) => {
    // Input checking
    await Promise.all([
        param('userId').isInt().withMessage('userId must be an integer').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        const reservedCalendars = await getReservedCalendarsByCustomerService(req.params.userId);
        res.status(200).json({message: "Found Successfully", reservedCalendars: reservedCalendars});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};



// @desc Create a new reservedCalendar
// @route POST /api/reservedCalendar
// @access public
const createReservedCalendar = async (req, res) => {
    // Input checking
    await Promise.all([
        body('listingId').exists().withMessage('listingId is Mandatory')
            .isInt().withMessage('listingId must be an integer').run(req),
        body('listingCalendar_Date').exists().withMessage('listingCalendar_Date is Mandatory')
            .isDate().withMessage('listingCalendar_Date must be a Date').run(req),
        body('customerId').exists().withMessage('customerId is Mandatory')
            .isDecimal().withMessage('customerId must be an integer').run(req),
        body('paymentId').exists().withMessage('paymentId is Mandatory')
            .isDecimal().withMessage('paymentId must be an integer').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        await AddReservedCalendarService(req.body);
        res.status(200).json({message: "Insert Sucessful"});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else if (err instanceof ItemAlreadyExistsError
                ||  err instanceof MissingFieldsError
                ||  err instanceof InvalidDataFormatError
                ||  err instanceof RuleViolationError) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// // @desc Update an available reservedCalendar
// // @route PUT /api/reservedCalendar/
// // @access public
// const updateAvailableReservedCalendar = async (req, res) => {
//     try {
//         await UpdateAvailableReservedCalendarService(req.body);
//         res.status(200).json({message: "Update Sucessful"});
//     } catch (err) {
//         if (err instanceof NotFoundError) {
//             res.status(404).json({message: err.message});
//         } else if (err instanceof MissingFieldsError
//                 ||  err instanceof InvalidDataFormatError
//                 ||  err instanceof ItemAlreadyExistsError
//                 ||  err instanceof RuleViolationError) {
//             res.status(400).json({message: err.message});
//         } else {
//             res.status(500).json({message: err.message});
//         }
//     }
// };


// // @desc Delete an available reservedCalendar
// // @route DELETE /api/reservedCalendar/:reservedId/:date
// // @access public
// const deleteAvailableReservedCalendar = async (req, res) => {
//     try {
//         await DeleteAvailableReservedCalendarService(req.params.reservedId, req.params.date);
//         res.status(200).json({message: "Delete Sucessful"});
//     } catch (err) {
//         if (err instanceof NotFoundError) {
//             res.status(404).json({message: err.message});
//         } else if (err instanceof RuleViolationError) {
//             res.status(400).json({message: err.message});
//         }
//         else {
//             res.status(500).json({message: err.message});
//         }
//     }
// };


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports =  {
    getReservedCalendarByIdentifier,
    getReservedCalendarsByListing,
    getReservedCalendarsByCustomer,
    createReservedCalendar
};

