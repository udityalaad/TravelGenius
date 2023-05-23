/*  **********************************************************
                    Imports
    ********************************************************** */
const express = require("express");
const router = express.Router();
const {
    getListingById,
    getListingByHostId,
    getListingAmenities,
    createListing,
    updateListingLicense,
    deleteListing
} = require("../Controllers/ListingController");


/*  **********************************************************
                    Routes
    ********************************************************** */
router.route('/:id').get(getListingById);
router.route('/listingByHost/:hostId').get(getListingByHostId);
router.route('/listingAmenities/:listingId').get(getListingAmenities);
router.route('/').post(createListing);
router.route('/updateLicense/').put(updateListingLicense);
router.route('/:id').delete(deleteListing);


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = router;