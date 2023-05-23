import {AUTHENTICATE} from "./Endpoints";

async function Authenticate(username, password) {
    console.log(`${AUTHENTICATE}/${username}/${password}`)
    try {
        return (await fetch(
            `${AUTHENTICATE}/${username}/${password}`,
            {
                method: 'GET'
            }
        )).json()
    } catch (error) {
        return {
            'Error': error
        }
    }
}

export default Authenticate;