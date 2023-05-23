import React, {useEffect, useState} from "react";

import "./mylistings.css";
import Navbar from "../../components/navbar/Navbar";
import GetListingsByHostId from "../../API/GetListingsByHostId";
import {MyListingCard} from "./MyListingCard";


const MyListings = ({props}) => {
    const hostid = localStorage.getItem("ece656_userid");
    const [myListings, setMyListings] = useState([]);

    React.useEffect( () => {
        const fetchListings = async () => {
            const result = await GetListingsByHostId(hostid);
            if(result != null && result.message === "Found Successfully"){
                setMyListings(result.listings)
                console.log(result)
            }else{
            }
        }
        fetchListings();
    }, [])

    return (
    <div style={{textAlign: "center"}}>
        <Navbar openTab="mylistings" />
        <div style={{marginLeft: "30%"}}>
        {
            myListings != null &&
                myListings.map(e => <MyListingCard key={e.listingId} e={e}></MyListingCard>)
        }
        </div>
    </div>
    );
};

export default MyListings;
