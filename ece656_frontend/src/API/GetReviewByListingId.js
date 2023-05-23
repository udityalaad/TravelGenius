import {REVIEW_BY_LISTING_ID} from "./Endpoints";

async function GetReviewByListingID(id) {
    try {
        return (await fetch(
            `${REVIEW_BY_LISTING_ID}/${id}`,
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

export default GetReviewByListingID;