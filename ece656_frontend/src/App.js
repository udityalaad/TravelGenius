import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import React from 'react';
import Availability from "./pages/availablity/Availability";
import Bookings from "./pages/Bookings/Bookings";
import LogIn from "./pages/LogIn/LogIn"
import SignUp from "./pages/SignUp/SignUp";
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";
import UpdateHostProfile from "./pages/UpdateHostProfile/UpdateHostProfile";
import CreateListing from "./pages/CreateListing/CreateListing";
import MyListings from "./pages/MyListings/MyListings";
import ManageListing from "./pages/ManageListing/ManageListing";
import NewBookings from "./pages/NewBookings/NewBookings";

function App() {
    const role = localStorage.getItem("ece656_role")

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LogIn/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                {
                    role === 'customer' &&
                        <>
                            <Route path="/hotels" element={<Home/>}/>
                            <Route path="/availability/:id" element={<Availability/>}/>
                            <Route path="/bookings" element={<Bookings/>}/>
                            <Route path="/newbookings" element={<NewBookings/>}/>
                            <Route path="/updateprofile" element={<UpdateProfile/>}/>
                        </>
                }
                {
                    role === 'host' &&
                        <>
                            <Route path="/updatehostprofile" element={<UpdateHostProfile/>}/>
                            <Route path="/createnewlisting" element={<CreateListing/>}/>
                            <Route path="/mylistings" element={<MyListings/>}/>
                            <Route path="/managelisting/:id" element={<ManageListing/>}/>
                        </>
                }
            </Routes>
        </BrowserRouter>
    );
}

export default App;
