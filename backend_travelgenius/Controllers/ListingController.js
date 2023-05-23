/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getListingByIdService,
        getListingByHostIdService,
        getListingAmenitiesService,
        AddListingService,
        UpdateListingLicenseService,
        DeleteListingService
    } = require("../Services/ListingService");

const { param, body, validationResult } = require('express-validator');

const NotFoundError = require("../Errors/NotFoundError");
const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");
const MissingFieldsError = require("../Errors/MissingFieldsError");
const InvalidDataFormatError = require("../Errors/InvalidDataFormatError");
const RuleViolationError = require("../Errors/RuleViolationError");

/*  **********************************************************
                    Controllers
    ********************************************************** */
// @desc Get listing by id
// @route GET /api/listing/:id
// @access public
const getListingById = async (req, res) => {
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
        const listing = await getListingByIdService(req.params.id);
        res.status(200).json({message: "Found Successfully", listing: listing});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// @desc Get listing by id
// @route GET /api/listing/:hostId
// @access public
const getListingByHostId = async (req, res) => {
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
        const listings = await getListingByHostIdService(req.params.hostId);
        res.status(200).json({message: "Found Successfully", listings: listings});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};


// @desc Get listing by id
// @route GET /api/listingAmenities/:listingId
// @access public
const getListingAmenities = async (req, res) => {
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
        const listings = await getListingAmenitiesService(req.params.listingId);
        res.status(200).json({message: "Found Successfully", amenities: listings});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};



// @desc Create a new listing
// @route POST /api/listing
// @access public
const createListing = async (req, res) => {
    // Input checking
    await Promise.all([
        body('listingName').optional().isString().withMessage('listingName must be a string').run(req),
        body('listingDescription').optional().isString().withMessage('listingDescription must be a string').run(req),
        body('listingPictureUrl').exists().withMessage('listingPictureUrl is Mandatory')
            .isURL().withMessage('Invalid listingPictureUrl').run(req),
        body('listingLicense').optional().isString().withMessage('listingLicense must be a string').run(req),
        body('listingInstantBookable').exists().withMessage('listingInstantBookable is Mandatory')
            .isIn(['0', '1']).withMessage('listingInstantBookable must be an binary').run(req),
        body('listingMinimumNights').optional().isInt().withMessage('listingMinimumNights must be an integer').run(req),
        body('listingMaximumNights').optional().isInt().withMessage('listingMaximumNights must be an integer').run(req),
        body('hostId').exists().withMessage('hostId is Mandatory')
            .isInt().withMessage('hostId must be an integer').run(req),

        body('propertyType').exists().withMessage('propertyType is Mandatory')
            .isString().withMessage('propertyType must be a string').run(req),
        body('roomType').exists().withMessage('roomType is Mandatory')
            .isString().withMessage('roomType must be a string').run(req),
        body('accommodates').exists().withMessage('accommodates is Mandatory')
            .isInt().withMessage('accommodates must be an integer').run(req),
        body('noBathrooms').optional().isDecimal().withMessage('noBathrooms must be an decimal').run(req),
        body('bathroomType').optional().isString().withMessage('bathroomType must be a string').run(req),
        body('noBedrooms').optional().isInt().withMessage('noBedrooms must be an integer').run(req),
        body('noBeds').optional().isInt().withMessage('noBeds must be an integer').run(req),
        body('amenities').optional().isArray().withMessage('amenities must be an array').run(req),
        body('propertyNeighbourhood').optional().isString().withMessage('propertyNeighbourhood must be a string').run(req),
        body('propertyNeighborhoodOverview').optional().isString().withMessage('propertyNeighborhoodOverview must be a string').run(req),
        body('propertyNeighbourhoodCleansed').optional().isString().withMessage('propertyNeighbourhoodCleansed must be a string').run(req),
        body('propertyCoordinates').exists().withMessage('propertyCoordinates is Mandatory')
            //.isJSON().withMessage('propertyCoordinates must be of the form {x: decimal, y: decimal}')
            .run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        const result = await AddListingService(req.body);
        res.status(200).json({message: "Insert Sucessful", listingId: result});
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


// @desc Update a listing license
// @route PUT /api/listing/updateLicense/
// @access public
const updateListingLicense = async (req, res) => {
    // Input checking
    await Promise.all([
        body('listingId').exists().withMessage('listingId is Mandatory')
            .isInt().withMessage('listingId must be an integer').run(req),
        body('listingLicense').exists().withMessage('listingLicense is Mandatory')
            .isString().withMessage('listingLicense must be a string').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        await UpdateListingLicenseService(req.body.listingId, req.body.listingLicense);
        res.status(200).json({message: "Update Sucessful"});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else if (err instanceof MissingFieldsError
            ||  err instanceof RuleViolationError) {
            res.status(400).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};




// @desc Delete a listing
// @route DELETE /api/listing/:id
// @access public
const deleteListing = async (req, res) => {
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
        await DeleteListingService(req.params.id);
        res.status(200).json({message: "Deletion Sucessful"});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports =  {
    getListingById,
    getListingByHostId,
    getListingAmenities,
    createListing,
    updateListingLicense,
    deleteListing
};

