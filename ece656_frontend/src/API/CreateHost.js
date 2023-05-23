import { HOST_API } from "./Endpoints";
async function CreateHost(host) {
    try {
        return (await fetch(
            `${HOST_API}/`,
            {
                method: 'POST',
                body: JSON.stringify(host),
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

export default CreateHost;
