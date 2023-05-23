import { LISTING_BY_IDENTIFIER } from "./Endpoints";

async function GetListingByIdentifier(listingid, date) {
    try {
        return (await fetch(
            `${LISTING_BY_IDENTIFIER}/${listingid}/${date}`,
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

export default GetListingByIdentifier;