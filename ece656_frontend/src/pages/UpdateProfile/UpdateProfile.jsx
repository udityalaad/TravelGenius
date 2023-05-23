import React, { useState, useEffect } from "react";

import "./updateProfile.css";
import Navbar from "../../components/navbar/Navbar";
import isAuthenticated from "../../utils/IsAuthenticated";
import {useNavigate} from "react-router-dom";
import getReservedCalendarByUserId from "../../API/GetReservedCalendarByUserId";
import AddReview from "../../API/AddReview";
import {Button} from "react-bootstrap";
import GetCustomer from "../../API/GetCustomer";
import UpdateCustomer from "../../API/UpdateCustomer";
import DeactivateCustomer from "../../API/DeactivateCustomer";


const UpdateProfile = ({props}) => {
    const navigate = useNavigate(); // Example for login
    const userId = localStorage.getItem("ece656_userid");
    const userrole = localStorage.getItem("ece656_role");
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    React.useEffect(() => {
        const loggedIn = isAuthenticated();
        if (!loggedIn || userId == null || userId == undefined || userrole !== 'customer') {
            navigate("/login")
        }
    })

    const handleSubmit = async () => {
        if(username == null || email == null || username === '' || email === ''){
            alert('Please Enter Valid Information.')
            return;
        }
        const payload = {
            'userId': userId,
            'userName': username,
            'userEmail': email
        }
        const response = await UpdateCustomer(payload)
        if(response.message === 'Update Sucessful'){
            alert("Update Successful !")
        } else {
            alert(response.message)
        }
    }

    const handleDeactivateAccount = async () => {
        const response = await DeactivateCustomer(userId);
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
            const customer = await GetCustomer(userId);
            setEmail(customer.customer.userEmail)
            setUserName(customer.customer.userName)
        }
        updateEmail();
    }, [])

    return (
        <div style={{textAlign: "center"}}>
            <Navbar openTab="profile" />
            <div>
                <h1>Update Profile Form</h1>
                <form style={{margin: "20px"}}>
                    <div>
                        Uesr Id: <input type="text" name="username" className="updateprofile" placeholder="UserId"
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

export default UpdateProfile;
