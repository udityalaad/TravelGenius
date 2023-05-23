import { REVIEW_BY_ID } from "./Endpoints";

async function GetReviewByID(id) {
    try {
        return (await fetch(
            `${REVIEW_BY_ID}/${id}`,
            {
                method: 'GET'
            }
        )).json()
    }catch(error){
        return {
            'Error': error
        }
    }
}

export default GetReviewByID;