import {LISTING_CALENDAR_BY_SEARCH_QUERY} from "./Endpoints";

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


async function GetListingCalendarsBySearchQuery(payload) {
    console.log(convertJsonToParamString_listingCalendarsBySearchQuery(payload))
    try {
        return (await fetch(
            `${LISTING_CALENDAR_BY_SEARCH_QUERY}/${convertJsonToParamString_listingCalendarsBySearchQuery(payload)}`,
            {
                method: 'GET'
            }
        )).json()


    } catch (error) {
        return {
            'Error': error
        }
    }
}

export default GetListingCalendarsBySearchQuery;