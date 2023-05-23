import {REVIEW_BY_HOST_ID} from "./Endpoints";

async function GetReviewByHostId(id) {
    try {
        return (await fetch(
            `${REVIEW_BY_HOST_ID}/${id}`,
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

export default GetReviewByHostId;