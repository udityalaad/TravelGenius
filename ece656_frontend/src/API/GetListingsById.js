import {LISTING_API} from "./Endpoints";

async function GetListingById(id) {
    try {
        return (await fetch(
            `${LISTING_API}/${id}`,
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

export default GetListingById;