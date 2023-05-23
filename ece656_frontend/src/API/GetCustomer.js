import { CUSTOMER_API } from "./Endpoints";

async function GetCustomer(id) {
    try {
        return (await fetch(
            `${CUSTOMER_API}/${id}`,
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

export default GetCustomer;