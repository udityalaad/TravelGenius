import {UPDATE_LICENSE_OF_LISTING_API} from "./Endpoints";
// FIX THIS
async function UpdateLicense(listing) {
    try {
        return (await fetch(
            `${UPDATE_LICENSE_OF_LISTING_API}/`,
            {
                method: 'PUT',
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

export default UpdateLicense;
