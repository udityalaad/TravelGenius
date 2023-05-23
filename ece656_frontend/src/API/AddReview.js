import { REVIEW_API } from "./Endpoints";

async function AddReview(payload) {
    try {
        return (await fetch(
            `${REVIEW_API}/`,
            {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            },
        )).json()
    }catch(error){
        return {
            'Error': error
        }
    }
}

export default AddReview;
