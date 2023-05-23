/*  **********************************************************
                    Imports
    ********************************************************** */
const express = require("express");
const router = express.Router();
const {
    getReservedCalendarByIdentifier,
    getReservedCalendarsByListing,
    getReservedCalendarsByCustomer,
    createReservedCalendar
} = require("../Controllers/ReservedCalendarController");


/*  **********************************************************
                    Routes
    ********************************************************** */
router.route('/reservedCalendarByIdentifier/:listingId/:date').get(getReservedCalendarByIdentifier);
router.route('/reservedCalendarsByListing/:listingId').get(getReservedCalendarsByListing);
router.route('/reservedCalendarsByCustomer/:userId').get(getReservedCalendarsByCustomer);
router.route('/').post(createReservedCalendar);


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = router;