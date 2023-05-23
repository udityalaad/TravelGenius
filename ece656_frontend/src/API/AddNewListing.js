import { LISTING_API } from "./Endpoints";
// FIX THIS
async function AddNewListing(listing) {
    try {
        return (await fetch(
            `${LISTING_API}/`,
            {
                method: 'POST',
                body: JSON.stringify(listing),
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

export default AddNewListing;
