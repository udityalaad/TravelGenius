/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getHostByIdService,
        AddHostService,
        UpdateHostService,
        DeleteHostService
    } = require("../Services/HostService");

const { param, body, validationResult } = require('express-validator');
const { isURL } = require('validator');

const NotFoundError = require("../Errors/NotFoundError");
const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");
const MissingFieldsError = require("../Errors/MissingFieldsError");
const InvalidDataFormatError = require("../Errors/InvalidDataFormatError");
const { passwordPattern } = require("../Helpers/CommonData");


/*  **********************************************************
                    Controllers
    ********************************************************** */
// @desc Get host
// @route GET /api/host/:id
// @access public
const getHosts = async (req, res) => {
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
        const host = await getHostByIdService(req.params.id);
        res.status(200).json({message: "Found Successfully", host: host});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};

// @desc Create a new host
// @route POST /api/host
// @access public
const createHost = async (req, res) => {
    // Input checking
    await Promise.all([
        body('userName').exists().withMessage('userName is Mandatory')
            .isString().withMessage('userName must be a string').run(req),
        body('userEmail').exists().withMessage('userEmail is Mandatory')
            .isEmail().withMessage(`Invalid Email Id`).run(req),
        body('password').exists().withMessage('password is Mandatory')
            .matches(passwordPattern).withMessage('password requirements not met').run(req),
        body('hostAbout').optional().isString().withMessage('hostAbout must be a string').run(req),
        body('isSuperhost').optional().isIn(['0','1']).withMessage('isSuperhost must be a binary').run(req),
        body('hostThumbnailUrl').optional().isURL().withMessage(`Invalid Thumbnail URL`).run(req),
        body('hostPictureUrl').optional().isURL().withMessage(`Invalid Picture URL`).run(req),
        body('hostLocation').optional().isString().withMessage('hostLocation must be a string').run(req),
        body('hostNeighbourhood').optional().isString().withMessage('hostNeighbourhood must be a string').run(req),
        // body('hostIsIdentityVerified').optional().isIn(['0','1']).withMessage('hostIsIdentityVerified must be a binary').run(req),
        // body('hostVerificationSources').optional().isString().withMessage('hostVerificationSources must be a string').run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        const result = await AddHostService(req.body);
        res.status(200).json({message: "Insert Sucessful", userId: result});
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


// @desc Update a host
// @route PUT /api/host/
// @access public
const updateHost = async (req, res) => {
    // Input checking
    await Promise.all([
        body('userId').exists().withMessage('userId is Mandatory')
            .isInt().withMessage('userId must be a integer').run(req),
        body('userName').exists().withMessage('userName is Mandatory')
            .isString().withMessage('userName must be a string').run(req),
        body('userEmail').exists().withMessage('userEmail is Mandatory')
            .isEmail().withMessage(`Invalid Email Id`).run(req),
        body('hostAbout').optional().isString().withMessage('hostAbout must be a string').run(req),
        body('isSuperhost').optional().isIn(['0','1']).withMessage('isSuperhost must be a binary').run(req),
        body('hostThumbnailUrl').optional().isURL().withMessage(`Invalid Thumbnail URL`).run(req),
        body('hostPictureUrl').optional().isURL().withMessage(`Invalid Picture URL`).run(req),
        body('hostLocation').optional().isString().withMessage('hostLocation must be a string').run(req),
        body('hostNeighbourhood').optional().isString().withMessage('hostNeighbourhood must be a string').run(req),
        // body('hostIsIdentityVerified').optional().isIn(['0','1']).withMessage('hostIsIdentityVerified must be a binary').run(req),
        // body('hostVerificationSources').optional().isString().withMessage('hostVerificationSources must be a string').run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        await UpdateHostService(req.body);
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


// @desc Delete a host
// @route DELETE /api/host/:id
// @access public
const deleteHost = async (req, res) => {
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
        await DeleteHostService(req.params.id);
        res.status(200).json({message: "Delete Sucessful"});
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
    getHosts, 
    createHost, 
    updateHost, 
    deleteHost
};

