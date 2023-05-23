/*  **********************************************************
                    Imports
    ********************************************************** */


/*  **********************************************************
                    Common Methods
    ********************************************************** */
// Listing Calendars Search API
const convertJsonToParamString_listingCalendarsBySearchQuery = (input) => {
    const output = input.dateRange.lowerBound + '/' +
                          input.dateRange.upperBound + '/' +
                          input.priceRange.lowerBound + '/' +
                          input.priceRange.upperBound + '/' +
                          input.noBeds.lowerBound + '/' +
                          input.noBeds.upperBound + '/' +
                          input.location.position.x + '/' +
                          input.location.position.y + '/' +
                          input.location.maxRange;
    return output;
}


/*  **********************************************************
                    Exports
    ********************************************************** */
module.exports = {
    convertJsonToParamString_listingCalendarsBySearchQuery
};