/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getReviewByIdService,
        getReviewsForOrByDifferentEntitiesService,
        AddReviewService,
        DeleteReviewService
    } = require("../Services/ReviewService");

const { param, body, validationResult } = require('express-validator');
const NotFoundError = require("../Errors/NotFoundError");

const ItemAlreadyExistsError = require("../Errors/ItemAlreadyExistsError");
const MissingFieldsError = require("../Errors/MissingFieldsError");
const InvalidDataFormatError = require("../Errors/InvalidDataFormatError");

/*  **********************************************************
                    Controllers
    ********************************************************** */
// @desc Get review
// @route GET /api/review/:id
// @access public
const getReviewById = async (req, res) => {
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
        const review = await getReviewByIdService(req.params.id);
        res.status(200).json({message: "Found Successfully", review: review});
    } catch (err) {
        if (err instanceof NotFoundError) {
            res.status(404).json({message: err.message});
        } else {
            res.status(500).json({message: err.message});
        }
    }
};


// @desc Get review
// @route GET /api/review/reviewsByCustomer/:reviewerId
// @access public
const getReviewsByCustomer = async (req, res) => {
    // Input checking
    await Promise.all([
        param('reviewerId').isInt().withMessage('reviewerId must be an integer').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    try {
        const review = await getReviewsForOrByDifferentEntitiesService('reviewerId', req.params.reviewerId);
        res.status(200).json({message: "Found Successfully", reviews: review});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};


// @desc Get review
// @route GET /api/review/reviewsForHost/:hostId
// @access public
const getReviewsForHost = async (req, res) => {
    // Input checking
    await Promise.all([
        param('hostId').isInt().withMessage('hostId must be an integer').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    try {
        const review = await getReviewsForOrByDifferentEntitiesService('hostId', req.params.hostId);
        res.status(200).json({message: "Found Successfully", reviews: review});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};


// @desc Get review
// @route GET /api/review/reviewsForListing/:listingId
// @access public
const getReviewsForListing = async (req, res) => {
    // Input checking
    await Promise.all([
        param('listingId').isInt().withMessage('listingId must be an integer').run(req)
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    try {
        const review = await getReviewsForOrByDifferentEntitiesService('listingId', req.params.listingId);
        res.status(200).json({message: "Found Successfully", reviews: review});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};



// @desc Create a new review
// @route POST /api/review
// @access public
const createReview = async (req, res) => {
    // Input checking
    await Promise.all([
        body('listingId').exists().withMessage('listingId is Mandatory')
            .isInt().withMessage('listingId must be an integer').run(req),
        body('reviewerId').exists().withMessage('reviewerId is Mandatory')
            .isInt().withMessage('reviewerId must be an integer').run(req),
        body('reviewComments').exists().withMessage('reviewComments is Mandatory')
            .isString().withMessage('reviewComments must be a string').run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: errors.array().map(err => err.msg)})
    }

    // Action
    try {
        const result = await AddReviewService(req.body);
        res.status(200).json({message: "Insert Sucessful", reviewId: result});
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


// // @desc Update a review
// // @route PUT /api/review/
// // @access public
// const updateReview = async (req, res) => {
//     try {
//         await UpdateReviewService(req.body);
//         res.status(200).json({message: "Update Sucessful"});
//     } catch (err) {
//         if (err instanceof NotFoundError) {
//             res.status(404).json({message: err.message});
//         } else if (err instanceof MissingFieldsError
//                 ||  err instanceof InvalidDataFormatError
//                 ||  err instanceof ItemAlreadyExistsError) {
//             res.status(400).json({message: err.message});
//         } else {
//             res.status(500).json({message: err.message});
//         }
//     }
// };


// @desc Delete a review
// @route DELETE /api/review/:id
// @access public
const deleteReview = async (req, res) => {
    try {
        await DeleteReviewService(req.params.id);
        res.status(200).json({message: "Delete Sucessful"});
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
    getReviewById,
    getReviewsByCustomer,
    getReviewsForHost,
    getReviewsForListing,
    createReview,
    // updateReview,
    deleteReview
};

