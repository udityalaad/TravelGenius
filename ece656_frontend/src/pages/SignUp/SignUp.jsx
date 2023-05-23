import React, {useState} from "react";

import "./signUp.css";
import {Button, ButtonGroup, ToggleButton} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import createCustomer from "../../API/CreateCustomer";
import createHost from "../../API/CreateHost";

const SignUp = ({props}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [usertype, setUsertype] = useState('customer');
    const [superHost, setSuperHost] = useState();
    const [hostThumbnailUrl, setHostThumbnailUrl] = useState();
    const [hostPictureUrl, setHostPictureUrl] = useState();
    const [hostNeighbourhood, setHostNeighbourhood] = useState();
    const [hostAbout, setHostAbout] = useState();
    const [hostLocation, setHostLocation] = useState();
    const navigate = useNavigate();

    const handleOptionChange = (event) => {
        setUsertype(event.target.value);
    };
    const handleSuperHostChange = (event) => {
        setSuperHost(event.target.value);
    };

    const handleSignUp = async () => {

        if (username == null || password == null || email == null || password.length < 1 || username.length < 1 || email.length < 1) {
            alert("Please Enter Valid detail");
            return;
        }

        function processResponse(response) {
            if (response != null && response.message.toString().substring(0, 6) === "Insert") {
                alert("Sign up successfully (" + response.userId + ").")
                navigate("/login");
            } else {
                if (response.message !== undefined) {
                    alert("Signup failed with error message" + response.message)
                }
                if (response.Error !== undefined) {
                    alert("Signup failed with error" + response.Error)
                }
            }
        }

        if (usertype === 'customer') {
            const response = await createCustomer({
                userName: username, userEmail: email, password: password
            });
            processResponse(response)
        } else {
            const requiredField = [username, email, password, superHost, hostThumbnailUrl, hostPictureUrl, hostNeighbourhood];
            for (let i = 0; i < requiredField.length; i++){
                if(requiredField[i] == null || requiredField[i] == undefined || requiredField.length < 1){
                    alert("Please Enter Valid detail.")
                    return;
                }
            }
            const response = await createHost({
                userName: username, userEmail: email, password: password, isSuperhost: superHost,
                hostThumbnailUrl: hostThumbnailUrl, hostPictureUrl: hostPictureUrl,
                hostNeighbourhood: hostNeighbourhood, hostLocation: hostLocation, hostAbout: hostAbout
            });
            processResponse(response)
        }

    }

    return (<div style={{marginTop: "70px", textAlign: "center"}}>
            <h1>Sign Up Form</h1>
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
                    <input type="text" name="username" className="signup" placeholder="Username"
                           onChange={e => setUsername(e.target.value)}/>
                </div>
                <div>
                    <input type="email" name="email" className="signup" placeholder="Email Address"
                           onChange={e => setEmail(e.target.value)}/>
                </div>
                <div>
                    <input type="password" name="password" className="signup" placeholder="Password"
                           onChange={e => setPassword(e.target.value)}/>
                </div>
                {
                    usertype === 'host' && <>
                        <div>
                            <ButtonGroup toggle>
                                Is Super Host
                                <ToggleButton
                                    type="radio"
                                    variant={superHost === '1' ? 'primary' : 'secondary'}
                                    name="options"
                                    value="1"
                                    checked={superHost === '1'}
                                    onChange={handleSuperHostChange}
                                    style={{marginRight: '20px'}}
                                >
                                    Yes
                                </ToggleButton>
                                <ToggleButton
                                    type="radio"
                                    variant={superHost === '0' ? 'primary' : 'secondary'}
                                    name="options"
                                    value="0"
                                    checked={superHost === '0'}
                                    onChange={handleSuperHostChange}
                                >
                                    No
                                </ToggleButton>
                            </ButtonGroup>
                        </div>
                        <div>
                            <input type="text" name="hostThumbnailUrl" className="signup" placeholder="Host Thumbnail URL"
                                   onChange={e => setHostThumbnailUrl(e.target.value)}/>
                        </div>
                        <div>
                            <input type="text" name="hostPictureUrl" className="signup" placeholder="Host Picture URL"
                                   onChange={e => setHostPictureUrl(e.target.value)}/>
                        </div>
                        <div>
                            <input type="text" name="setHostNeighbourhood" className="signup" placeholder="Host Neighbourhood"
                                   onChange={e => setHostNeighbourhood(e.target.value)}/>
                        </div>

                        <div>
                            <input type="text" name="setHostLocation" className="signup" placeholder="Host Location"
                                   onChange={e => setHostLocation(e.target.value)}/>
                        </div>

                        <div>
                            <input type="text" name="setHostAbout" className="signup" placeholder="Host About"
                                   onChange={e => setHostAbout(e.target.value)}/>
                        </div>

                    </>
                }
                <div>
                    <Button onClick={handleSignUp} className="signup">Sign In</Button>
                </div>
                <div>
                    <Button onClick={() => navigate("/login")} className="signup">Log In</Button>
                </div>

            </form>
        </div>);
};

export default SignUp;
