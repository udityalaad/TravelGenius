import React, {useEffect} from "react";

import Header from "../../components/header/Header";
import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";

import "./home.css";
import GetListingCalendarsBySearchQuery from "../../API/GetListingCalendarsBySearchQuery";
import { ListingCard } from "../../components/listingCard/ListingCard";
import Navbar from "../../components/navbar/Navbar";
import isAuthenticated from "../../utils/IsAuthenticated";

const Home = ({props}) => {
    const location = useLocation();
    const userrole = localStorage.getItem("ece656_role");

    const [destination, setDestination] = useState(location.state == null ? "" : location.state.destination);
    const [openDate, setOpenDate] = useState(false);
    const [posX, setPosX] = useState(43);
    const [posY, setPosY] = useState(-75);
    const [minBeds, setMinBeds] = useState(1);
    const [maxBeds, setMaxBeds] = useState(4);
    const [minPrice, setMinPrice] = useState(100);
    const [maxPrice, setMaxPrice] = useState(400);
    const [range, setRange] = useState(100);
    const [status, setStatus] = useState("Use Parameters to search");

    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        room: 1,
    });
    const [searchResult, setSearchResult] = new useState([])

    const navigate = useNavigate(); // Example for login
    React.useEffect(() => {
        if(userrole === "host"){
            navigate("/createnewlisting")
        }
        const loggedIn = isAuthenticated();
        if (!loggedIn) {
            navigate("/login")
        }
    })

    // TODO: (Nirav)
    const handleSearch = async () => {
        console.log(posX + " " + posY)
        console.log(date[0].startDate.toISOString().slice(0, 10) + " " + date[0].endDate.toISOString().slice(0, 10))
        console.log(minPrice + " " + maxPrice)
        console.log(minBeds + " " + maxBeds)
        console.log(range)
        // console.log()
        const payload = {
            "dateRange": {
                "lowerBound": date[0].startDate.toISOString().slice(0, 10),
                "upperBound": date[0].endDate.toISOString().slice(0, 10)
            },
            "priceRange": {
                "lowerBound": minPrice,
                "upperBound": maxPrice
            },
            "noBeds": {
                "lowerBound": minBeds,
                "upperBound": maxBeds
            },
            "location": {
                "position": {
                    "x": posX,
                    "y": posY
                },
                "maxRange": range
            }
        };
        setStatus("Loading...")
        const listing1 = await GetListingCalendarsBySearchQuery(payload)
        let uniqueListing = new Set();
        let searchOutput = [];
        if(listing1.listingCalendars != undefined){
            listing1.listingCalendars.forEach(x => {
                if(!uniqueListing.has(x.listingId)){
                    uniqueListing.add(x.listingId)
                    searchOutput = [...searchOutput, x]
                }
            })

        }
        if (searchOutput.length == 0){
            setStatus("No Result Found");
        } else {
            setStatus("")
        }
        setSearchResult(searchOutput)
    }

    return (
        <div>
            <Navbar openTab="stays" />
            <Header setDestination={setDestination} setDate={setDate} setOpenDate={setOpenDate} setOptions={setOptions}
                    date={date} openDate={openDate} options={options} handleSearch={handleSearch} setPosX={setPosX}
                    setPosY={setPosY} setMinBeds={setMinBeds} setMaxBeds={setMaxBeds} setMinPrice={setMinPrice} setMaxPrice={setMaxPrice}
                    setRange={setRange}/>
            <div className="homeContainer">
                {
                    searchResult.length == 0 && <>{status}</>
                }
                {searchResult.map(e => (<ListingCard key={e.listingId} e={e}></ListingCard>))}
            </div>
        </div>
    );
};

export default Home;
