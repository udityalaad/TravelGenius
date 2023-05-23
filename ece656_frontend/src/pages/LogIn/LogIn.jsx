import React, { useState } from "react";

import "./logIn.css";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import authenticate from "../../API/Authenticate";
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import GetCustomer from "../../API/GetCustomer";
import GetHost from "../../API/GetHost";

const LogIn = ({props}) => {
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const navigate = useNavigate();
    const [usertype, setUsertype] = useState('customer');

    const handleOptionChange = (event) => {
        setUsertype(event.target.value);
    };

    const handleLogIn = async () => {
        const response = await authenticate(userName, password)
        if (response != null && response.message.toString().substring(0, 31) === "User Authentication Successfull") {
            if(usertype == 'customer'){
                const customer = await GetCustomer(response.userId);
                if (customer.customer == undefined){
                    alert("Invalid credentials");
                    return;
                }
            } else {
                const host = await GetHost(response.userId);
                if (host.host == undefined){
                    alert("Invalid credentials");
                    return;
                }
            }

            localStorage.setItem('ece656_role', usertype);
            localStorage.setItem('ece656_userid', response.userId);
            setErrorMessage(null);
            window.location.href = window.location.href;
        } else {
            setErrorMessage("Please Enter Valid Credential");
        }
    }

    React.useEffect(() => {
        if(localStorage.getItem('ece656_role') !== null){
            navigate("/")
        }
    }, [])

    return (
        <div style={{marginTop: "70px", textAlign: "center"}}>
            <h1>Log In Form</h1>
            {errorMessage}
                <ButtonGroup toggle>
                    <ToggleButton
                        type="radio"
                        variant={usertype === 'customer' ? 'primary' : 'secondary'}
                        name="options"
                        value="customer"
                        checked={usertype === 'customer'}
                        onChange={handleOptionChange}
                        style={{marginRight: '20px'}}
                    >
                        Customer
                    </ToggleButton>
                    <ToggleButton
                        type="radio"
                        variant={usertype === 'host' ? 'primary' : 'secondary'}
                        name="options"
                        value="host"
                        checked={usertype === 'host'}
                        onChange={handleOptionChange}
                    >
                        Host
                    </ToggleButton>
                </ButtonGroup>
            <form style={{margin: "20px"}}>
                <div>
                    <input type="text" name="userId" className="login" placeholder="UserEmail Or UserId"
                           onChange={e => setUserName(e.target.value)}/>
                </div>
                <div>
                    <input type="password" name="password" className="login" placeholder="Password"
                           onChange={e => setPassword(e.target.value)}/>
                </div>
                <div>
                    <Button onClick={handleLogIn} className="login">Log In</Button>
                </div>
                <div>
                    <Button onClick={() => navigate("/signup")} className="login">Sign Up</Button>
                </div>

            </form>
        </div>
    );
};

export default LogIn;
