import {HOST_API} from "./Endpoints";

async function DeactivateHost(id) {
    try {
        return (await fetch(
            `${HOST_API}/${id}`,
            {
                method: 'DELETE',
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

export default DeactivateHost;
