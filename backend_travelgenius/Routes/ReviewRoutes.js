/*  **********************************************************
                    Imports
    ********************************************************** */
const express = require("express");
const router = express.Router();
const {
    getReviewById,
    getReviewsByCustomer,
    getReviewsForHost,
    getReviewsForListing,
    createReview,
    deleteReview
} = require("../Controllers/ReviewController");


/*  **********************************************************
                    Routes
    ********************************************************** */
router.route('/:id').get(getReviewById);
router.route('/reviewsByCustomer/:reviewerId').get(getReviewsByCustomer);
router.route('/reviewsForHost/:hostId').get(getReviewsForHost);
router.route('/reviewsForListing/:listingId').get(getReviewsForListing);
router.route('/').post(createReview);
router.route('/:id').delete(deleteReview);


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = router;