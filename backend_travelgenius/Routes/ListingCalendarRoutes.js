/*  **********************************************************
                    Imports
    ********************************************************** */
const express = require("express");
const router = express.Router();
const {
    getListingCalendarByIdentifier,
    getListingCalendarsByListing,
    getListingCalendarsByHost,
    getListingCalendarsBySearchQuery,
    createListingCalendar,
    updateAvailableListingCalendar,
    deleteAvailableListingCalendar
} = require("../Controllers/ListingCalendarController");


/*  **********************************************************
                    Routes
    ********************************************************** */
router.route('/listingCalendarByIdentifier/:listingId/:date').get(getListingCalendarByIdentifier);
router.route('/listingCalendarsByListing/:listingId').get(getListingCalendarsByListing);
router.route('/listingCalendarsByHost/:hostId').get(getListingCalendarsByHost);
router.route('/listingCalendarsBySearchQuery/:dateRange_lowerBound' + 
                                            '/:dateRange_upperBound' +
                                            '/:priceRange_lowerBound' +
                                            '/:priceRange_upperBound' +
                                            '/:noBeds_lowerBound' +
                                            '/:noBeds_upperBound' +
                                            '/:location_position_x' +
                                            '/:location_position_y' +
                                            '/:location_maxRange').get(getListingCalendarsBySearchQuery);
router.route('/').post(createListingCalendar);
router.route('/').put(updateAvailableListingCalendar);
router.route('/:listingId/:date').delete(deleteAvailableListingCalendar);


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = router;