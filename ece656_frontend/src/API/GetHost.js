import { HOST_API } from "./Endpoints";

async function GetHost(id) {
    try {
        return (await fetch(
            `${HOST_API}/${id}`,
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

export default GetHost;