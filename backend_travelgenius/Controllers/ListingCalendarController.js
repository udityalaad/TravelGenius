/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getListingCalendarByIdentifierService,
        getListingCalendarsByListingService,
        getListingCalendarsByHostService,
        getAvailableListingCalendarsForTheSearchQueryService,
        AddListingCalendarService,
        UpdateAvailableListingCalendarService,
        DeleteAvailableListingCalendarService
    } = require("../Services/ListingCalendarService");

const { param, body, validationResult } = require('express-validator');

const NotFoundError = require("../Errors/NotFoundError");
const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");
const MissingFieldsError = require("../Errors/MissingFieldsError");
const InvalidDataFormatError = require("../Errors/InvalidDataFormatError");
const RuleViolationError = require("../Errors/RuleViolationError");


/*  **********************************************************
                    Controllers
    ********************************************************** */
// @desc Get ListingCalendarByIdentifier
// @route GET /api/listingCalendar/listingCalendarByIdentifier/:listingId/:date
// @access public
const getListingCalendarByIdentifier = async (req, res) => {
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
        const listingCalendar = await getListingCalendarByIdentifierService(req.params.listingId, req.params.date);
        res.status(200).json({message: "Found Successfully", listingCalendar: listingCalendar});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// @desc Get ListingCalendarsByListing
// @route GET /api/listingCalendar/listingCalendarsByListing/:listingId
// @access public
const getListingCalendarsByListing = async (req, res) => {
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
        const listingCalendars = await getListingCalendarsByListingService(req.params.listingId);
        res.status(200).json({message: "Found Successfully", listingCalendars: listingCalendars});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// @desc Get ListingCalendarsByHost
// @route GET /api/listingCalendar/listingCalendarsByHost/:hostId
// @access public
const getListingCalendarsByHost = async (req, res) => {
    // Input checking
    await Promise.all([
        param('hostId').isInt().withMessage('hostId must be an integer').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        const listingCalendars = await getListingCalendarsByHostService(req.params.hostId);
        res.status(200).json({message: "Found Successfully", listingCalendars: listingCalendars});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};



// @desc Get ListingCalendarsBySearchQuery
// @route GET /api/listingCalendar/listingCalendarsBySearchQuery/
// @access public
const getListingCalendarsBySearchQuery = async (req, res) => {
    // Input checking
    await Promise.all([
        param('dateRange_lowerBound').exists().withMessage('dateRange.lowerBound is Mandatory')
        .isDate().withMessage('dateRange.lowerBound must be a Date').run(req),
        param('dateRange_upperBound').exists().withMessage('dateRange.upperBound is Mandatory')
            .isDate().withMessage('dateRange.upperBound must be a Date').run(req),
        
        param('priceRange_lowerBound').exists().withMessage('priceRange.lowerBound is Mandatory')
            .isDecimal().withMessage('priceRange.lowerBound must be a Decimal').run(req),
        param('priceRange_upperBound').exists().withMessage('priceRange.upperBound is Mandatory')
            .isDecimal().withMessage('priceRange.upperBound must be a Decimal').run(req),

        param('noBeds_lowerBound').exists().withMessage('noBeds.lowerBound is Mandatory')
            .isInt().withMessage('noBeds.lowerBound must be an Integer').run(req),
        param('noBeds_upperBound').exists().withMessage('noBeds.upperBound is Mandatory')
            .isInt().withMessage('noBeds.upperBound must be an Integer').run(req),
        
        param('location_position_x').exists().withMessage('location.position.x is Mandatory')
            .isDecimal().withMessage('location.position.x must be a Decimal').run(req),
        param('location_position_y').exists().withMessage('location.position.y is Mandatory')
            .isDecimal().withMessage('location.position.y must be a Decimal').run(req),
        param('location_maxRange').exists().withMessage('location.maxRange is Mandatory')
            .isDecimal().withMessage('location.maxRange must be a Decimal').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    const queryInput = {
        "dateRange": {
          "lowerBound": req.params.dateRange_lowerBound,
          "upperBound": req.params.dateRange_upperBound
        },
        "priceRange": {
          "lowerBound": req.params.priceRange_lowerBound,
          "upperBound": req.params.priceRange_upperBound
        },
        "noBeds": {
          "lowerBound": req.params.noBeds_lowerBound,
          "upperBound": req.params.noBeds_upperBound
        },
        "location": {
          "position": {
            "x": req.params.location_position_x,
            "y": req.params.location_position_y
          },
          "maxRange": req.params.location_maxRange
        }
      };

    // Action
    try {
        const listingCalendars = await getAvailableListingCalendarsForTheSearchQueryService(queryInput);
        res.status(200).json({message: "Found Successfully", listingCalendars: listingCalendars});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } if (err instanceof RuleViolationError) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// @desc Create a new listingCalendar
// @route POST /api/listingCalendar
// @access public
const createListingCalendar = async (req, res) => {
    // Input checking
    await Promise.all([
        body('listingId').exists().withMessage('listingId is Mandatory')
            .isInt().withMessage('listingId must be an integer').run(req),
        body('listingCalendar_Date').exists().withMessage('listingCalendar_Date is Mandatory')
            .isDate().withMessage('listingCalendar_Date must be a Date').run(req),
        body('listingCalendar_Price').exists().withMessage('listingCalendar_Price is Mandatory')
            .isDecimal().withMessage('listingCalendar_Price must be a decimal').run(req),
        body('listingCalendar_AdjustedPrice').exists().withMessage('listingCalendar_AdjustedPrice is Mandatory')
            .isDecimal().withMessage('listingCalendar_AdjustedPrice must be a decimal').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        await AddListingCalendarService(req.body);
        res.status(200).json({message: "Insert Sucessful"});
    } catch (err) {
        if (err instanceof ItemAlreadyExistsError
                ||  err instanceof MissingFieldsError
                ||  err instanceof InvalidDataFormatError
                ||  err instanceof RuleViolationError) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// @desc Update an available listingCalendar
// @route PUT /api/listingCalendar/
// @access public
const updateAvailableListingCalendar = async (req, res) => {
    // Input checking
    await Promise.all([
        body('listingId').exists().withMessage('listingId is Mandatory')
            .isInt().withMessage('listingId must be an integer').run(req),
        body('listingCalendar_Date').exists().withMessage('listingCalendar_Date is Mandatory')
            .isDate().withMessage('listingCalendar_Date must be a Date').run(req),
        body('listingCalendar_Price').exists().withMessage('listingCalendar_Price is Mandatory')
            .isDecimal().withMessage('listingCalendar_Price must be a decimal').run(req),
        body('listingCalendar_AdjustedPrice').exists().withMessage('listingCalendar_AdjustedPrice is Mandatory')
            .isDecimal().withMessage('listingCalendar_AdjustedPrice must be a decimal').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        await UpdateAvailableListingCalendarService(req.body);
        res.status(200).json({message: "Update Sucessful"});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else if (err instanceof MissingFieldsError
                ||  err instanceof InvalidDataFormatError
                ||  err instanceof ItemAlreadyExistsError
                ||  err instanceof RuleViolationError) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// @desc Delete an available listingCalendar
// @route DELETE /api/listingCalendar/:listingId/:date
// @access public
const deleteAvailableListingCalendar = async (req, res) => {
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
        await DeleteAvailableListingCalendarService(req.params.listingId, req.params.date);
        res.status(200).json({message: "Delete Sucessful"});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else if (err instanceof RuleViolationError) {
            res.status(400).json({message: err.message});
        }
        else {
            res.status(500).json({message: err.message});
        }
    }
};


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports =  {
    getListingCalendarByIdentifier,
    getListingCalendarsByListing,
    getListingCalendarsByHost,
    getListingCalendarsBySearchQuery,
    createListingCalendar,
    updateAvailableListingCalendar,
    deleteAvailableListingCalendar
};

