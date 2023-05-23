/*  **********************************************************
                    Imports
    ********************************************************** */
const {
        getReviewByIdDAO,
        getReviewsForOrByDifferentEntitiesDAO,
        AddReviewDAO,
        DeleteReviewDAO
    } = require("../DAO/ReviewDAO");
const NotFoundError = require("../Errors/NotFoundError");
const MissingFieldsError = require("../Errors/MissingFieldsError");

// Remote Calls
const { getListingByIdService } = require("./ListingService");
const { getCustomerByIdService } = require("./CustomerService");


/*  **********************************************************
                    Services
    ********************************************************** */
// 1.1 Get Review By Id
const getReviewByIdService = async (reviewId) => {
    const review = await getReviewByIdDAO(reviewId);
    if (review.length == 0) {
        throw new NotFoundError(`Review with id ${reviewId} does not exist.`);
    }
    
    return review[0];
}

// 1.2 Get Reviews By/For Different Entities
const getReviewsForOrByDifferentEntitiesService = async (field, fieldValue) => {
    const reviews = await getReviewsForOrByDifferentEntitiesDAO(field, fieldValue);
    return reviews;
}

// 2. Add Review
const AddReviewService = async (review) => {
    const listing = await getListingByIdService(review.listingId);
    if (listing.length == 0) {
        throw new NotFoundError(`Listing with id ${review.listingId} does not exist.`);
    }

    const customer = await getCustomerByIdService(review.reviewerId);
    if (customer.length == 0) {
        throw new NotFoundError(`Customer with id ${review.reviewerId} does not exist.`);
    }
    
    const result = await AddReviewDAO(review);
    return result;
}


// 4. Delete Review
const DeleteReviewService = async (reviewId) => {
    await getReviewByIdService(reviewId);
    await DeleteReviewDAO(reviewId);
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    getReviewByIdService,
    getReviewsForOrByDifferentEntitiesService,
    AddReviewService,
    DeleteReviewService
}

