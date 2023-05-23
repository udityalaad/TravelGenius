import { LISTING_BY_HOST_ID } from "./Endpoints";

async function GetListingByHost(id) {
    try {
        return (await fetch(
            `${LISTING_BY_HOST_ID}/${id}`,
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

export default GetListingByHost;