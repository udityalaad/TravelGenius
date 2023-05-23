import React, { useState, useEffect } from "react";

import "./updateHostProfile.css";
import Navbar from "../../components/navbar/Navbar";
import isAuthenticated from "../../utils/IsAuthenticated";
import {useNavigate} from "react-router-dom";
import getReservedCalendarByUserId from "../../API/GetReservedCalendarByUserId";
import AddReview from "../../API/AddReview";
import {Button, ButtonGroup, ToggleButton} from "react-bootstrap";
import GetCustomer from "../../API/GetCustomer";
import UpdateCustomer from "../../API/UpdateCustomer";
import GetHost from "../../API/GetHost";
import UpdateProfileOfHost from "../../API/UpdateProfileOfHost";
import DeactivateCustomer from "../../API/DeactivateCustomer";
import DeactivateHost from "../../API/DeactivateHost";


const UpdateHostProfile = ({props}) => {
    const navigate = useNavigate(); // Example for login
    const userId = localStorage.getItem("ece656_userid");
    const userrole = localStorage.getItem("ece656_role");
    const [username, setUserName] = useState('');
    const [hostsince, setHostSince] = useState('');
    const [hostAbout, setHostAbout] = useState('');
    const [superHost, setSuperHost] = useState();
    const [email, setEmail] = useState('');
    const [hostThumbnailUrl, setHostThumbnailUrl] = useState('');
    const [hostPictureUrl, setHostPictureUrl] = useState();
    const [hostNeighbourhood, setHostNeighbourhood] = useState();
    React.useEffect(() => {
        const loggedIn = isAuthenticated();
        if (!loggedIn || userId == null || userId == undefined || userrole !== 'host') {
            navigate("/login")
        }
    })

    const handleSuperHostChange = (event) => {
        setSuperHost(event.target.value);
    };


    const handleSubmit = async () => {
        if(username == null || email == null || username === '' || email === ''){
            alert('Please Enter Valid Information.')
            return;
        }
        const payload = {
            'userId': userId,
            'userName': username,
            'userEmail': email,
            'isSuperhost': parseInt(superHost),
            'hostAbout': hostAbout,
            'hostThumbnailUrl': hostThumbnailUrl,
            'hostPictureUrl': hostPictureUrl,
            'hostNeighbourhood': hostNeighbourhood
        }
        console.log(payload)
        const response = await UpdateProfileOfHost(payload)
        if(response.message === 'Update Sucessful'){
            alert("Update Successful !")
        } else {
            alert(response.message)
        }
    }

    const handleDeactivateAccount = async () => {
        const response = await DeactivateHost(userId);
        alert(response.message)
        if(response.message === 'Update Sucessful'){
            localStorage.removeItem("ece656_role");
            localStorage.removeItem("ece656_userid");
            alert("Account Deactivated !")
            navigate("/")
        } else {
            alert(response.message)
        }
    }

    useEffect( () => {
        async function updateEmail () {
            const customer = await GetHost(userId);
            console.log(customer.host)
            setEmail(customer.host.userEmail)
            setUserName(customer.host.userName)
            setHostSince(customer.host.hostSince.substring(0, 16))
            setSuperHost(customer.host.isSuperhost + "")
            setHostAbout(customer.host.hostAbout)
            setHostThumbnailUrl(customer.host.hostThumbnailUrl)
            setHostPictureUrl(customer.host.hostPictureUrl)
            setHostNeighbourhood(customer.host.hostNeighbourhood)
        }
        updateEmail();
    }, [])

    return (
        <div>
            <Navbar openTab="profile" />
            <div style={{textAlign: "right", paddingRight: "40%"}}>
                <h1>Update Profile Form</h1>
                <form style={{margin: "20px"}}>
                    <div>
                        Uesr Id (readonly): <input type="text" name="username" className="updateprofile" placeholder="UserId"
                               value={userId} disabled/>
                    </div>
                    <div>
                        Username: <input type="text" name="username" className="updateprofile" placeholder="Username"
                               value={username} onChange={e => setUserName(e.target.value)}/>
                    </div>
                    <div>
                        Email:
                        <input type="email" name="email" className="updateprofile" placeholder="Email Address"
                               value={email} onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div>
                        Host Since (readonly):
                        <input type="datetime-local" name="hostsince" className="updateprofile" placeholder="Email Address"
                               value={hostsince} onChange={e => setHostSince(e.target.value)} disabled/>
                    </div>
                    <div>
                        Host About:
                        <input type="text" name="hostabout" className="updateprofile" placeholder="Host About"
                               value={hostAbout} onChange={e => setHostAbout(e.target.value)}/>
                    </div>
                    <div>
                        Thumbnail:
                        <input type="text" name="hostthumbnail" className="updateprofile" placeholder="Thumbnail"
                               value={hostThumbnailUrl} onChange={e => setHostThumbnailUrl(e.target.value)}/>
                    </div>
                    <div>
                        Picture URL:
                        <input type="text" name="hostpicture" className="updateprofile" placeholder="Picture URL"
                               value={hostPictureUrl} onChange={e => setHostPictureUrl(e.target.value)}/>
                    </div>
                    <div>
                        Neighbourhood:
                        <input type="text" name="hostneighbourhood" className="updateprofile" placeholder="Neighbourhood"
                               value={hostNeighbourhood} onChange={e => setHostNeighbourhood(e.target.value)}/>
                    </div>
                    <div>
                        <ButtonGroup value={{superHost}} toggle>
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
                    <div style={{marginRight: "15%"}}>
                        <Button onClick={handleSubmit} className="updateprofile">Submit</Button>
                    </div>
                </form>
            </div>
            <div style={{border: "1px black solid", margin: "5%"}}>
                To Deactivate Account Click here <Button onClick={handleDeactivateAccount} className="updateprofile">Deactivate Account</Button>
            </div>

        </div>
    );


};

export default UpdateHostProfile;
