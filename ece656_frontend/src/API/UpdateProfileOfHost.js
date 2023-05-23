import {HOST_API} from "./Endpoints";
// FIX THIS
async function UpdateLicense(listing) {
    try {
        return (await fetch(
            `${HOST_API}/`,
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
