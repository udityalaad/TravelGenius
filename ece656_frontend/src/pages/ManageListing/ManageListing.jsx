import React, {useState, useEffect} from "react";

import "./manageListing.css";
import Navbar from "../../components/navbar/Navbar";
import isAuthenticated from "../../utils/IsAuthenticated";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import AddNewListing from "../../API/AddNewListing";
import {ReviewCard} from "../../components/reviewCard/ReviewCard";
import GetReviewByListingID from "../../API/GetReviewByListingId";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDays} from "@fortawesome/free-solid-svg-icons";
import {format} from "date-fns";
import {DateRangePicker} from "react-date-range";
import GetListingById from "../../API/GetListingsById";
import AddListingCalendar from "../../API/AddListingCalendar";
import UpdateLicense from "../../API/UpdateLicense";
import RemoveListingCalendar from "../../API/RemoveListingCalendar";
import GetCalendarByListingId from "../../API/GetCalendarByListingId";
import GetListingByHIdentifier from "../../API/GetListingCalendarByIdentifier";
import GetListingByIdentifier from "../../API/GetListingCalendarByIdentifier";
import UpdateListingCalendar from "../../API/UpdateListingCalendar";


const ManageListing = ({props}) => {

    const {id: listingId} = useParams();

    const navigate = useNavigate(); // Example for login
    const [date, setDate] = useState('');
    const [reviews, setReviews] = useState([]);
    const [price, setPrice] = useState(120);
    const [adjPrice, setAdjPrice] = useState(120);
    const [listingName, setListingName] = useState('');
    const [listingDescription, setListingDescription] = useState('');
    const [listingLicense, setListingLicense] = useState('');
    const [removeDate, setRemoveDate] = useState();
    const [availabilities, setAvailabilities] = useState([]);
    const [updatePriceDate, setUpdatePriceDate] = useState();
    const [updateAdjPrice, setUpdateAdjPrice] = useState();
    const [updatePrice, setUpdatePrice] = useState();

    const handleAvailabiliyChange = async () => {
        const bookedCalendar = await GetCalendarByListingId(listingId);
        var names = bookedCalendar.listingCalendars.map(function(item) {
            return item['listingCalendar_Date'].substring(0, 10);
        });
        setAvailabilities(names);
    }

    React.useEffect(() => {
        const loggedIn = isAuthenticated();
        if (!loggedIn) {
            navigate("/login")
        }
    })

    React.useEffect( () => {
        const loggedIn = isAuthenticated();
        if (!loggedIn) {
            navigate("/login")
        }
        const fetchData = async () => {
            const _reviews = await GetReviewByListingID(listingId);
            setReviews(_reviews.reviews);

            const listing = await GetListingById(listingId);
            setListingName(listing.listing.listingName)
            setListingDescription(listing.listing.listingDescription)
            setListingLicense(listing.listing.listingLicense)
            handleAvailabiliyChange();
        }

        fetchData()
    }, [])


    const handleAddAvailability = async () => {
        if(date == null || date === '' || date == undefined || !(price > 0) || !(adjPrice > 0)){
            alert("Please select date");
            return;
        }
        const payload = {
            "listingId": listingId,
            "listingCalendar_Date": date,
            "listingCalendar_Price": price,
            "listingCalendar_AdjustedPrice": adjPrice
        }
        const result = await AddListingCalendar(payload);
        if(result != null && result.message === "Insert Sucessful"){
            alert("Listing Calendar Has been Added!")
        } else {
            alert(result.message)
        }
        handleAvailabiliyChange();
    }

    const handleRemoveAvailability = async () => {
        if(removeDate == null || removeDate === '' || removeDate == undefined){
            alert("Please select date to remove listing");
            return;
        }
        const result = await RemoveListingCalendar(listingId, removeDate);
        if(result != null && result.message === "Insert Sucessful"){
            alert("Listing Calendar Has been Added!")
            setDate(null)
        } else {
            alert(result.message)
        }
        handleAvailabiliyChange();
    }

    const handleUpdatePriceDateChange = async (e) => {
        setUpdatePriceDate(e.target.value)
        const fetchData = async () => {
            const date = e.target.value;
            const listingInfo = await GetListingByIdentifier(listingId, date);
            if(listingInfo == null || listingInfo.message != "Found Successfully"){
                alert(listingInfo.message);
            }else {
                setUpdatePrice(listingInfo.listingCalendar.listingCalendar_Price)
                setUpdateAdjPrice(listingInfo.listingCalendar.listingCalendar_AdjustedPrice)
            }
        }
        fetchData()
    }

    const handleUpdatePricing = async () => {
        const payload = {
            "listingId": listingId,
            "listingCalendar_Date": updatePriceDate,
            "listingCalendar_Price": updatePrice,
            "listingCalendar_AdjustedPrice": updateAdjPrice
        }
        const result = await UpdateListingCalendar(payload);
        if(result != null && result.message === "Update Sucessful"){
            alert("Listing Calendar Has been Updated!")
        } else {
            alert(result.message)
        }

    }

    const handleSubmit = async () => {
        if(listingLicense == null || listingLicense == undefined || listingLicense < 1){
            alert("Please Enter Valid value of License ")
            return;
        }
        const payload = {
            "listingId": listingId,
            "listingLicense": listingLicense
        }
        const response = await UpdateLicense(payload);
        if(response != null && response.message === "Insert Sucessful"){
            alert("Listing has been added Successfully !")
            navigate("/mylistings")
        } else {
            alert(response.message);
        }
    }

    return (
        <>
            <div style={{textAlign: "right", fontSize: "14px"}}>
                <Navbar openTab="mylistings"/>
                <div style={{marginRight: "40%", marginTop: "2%"}}>
                    <h1>Managing listing Id {listingId} </h1>
                </div>
                <div style={{border: "1px solid black", margin: "1%"}}>
                    <div className="headerSearchItem" style={{padding: '2%'}}>
                        <h2>Add Availability</h2>
                        <input type="date" className="createlisting" name="date"  value={date} onChange={e => setDate(e.target.value)}/>
                        <input type="number" className="createlisting" placeholder="Listing Price" value={price}
                               name="price" onChange={e => setPrice(e.target.value)}/>
                        <input type="number" className="createlisting" placeholder="Listing Adjusted Price" value={adjPrice}
                               name="adjPrice" onChange={e => setAdjPrice(e.target.value)}/>
                        <div>
                            <Button onClick={handleAddAvailability} className="createlisting">Add Availability</Button>
                        </div>
                    </div>
                </div>
                <div style={{border: "1px solid black", margin: "1%"}}>
                    <div className="headerSearchItem" style={{padding: '2%'}}>
                        <h2>Remove Availability</h2>
                        <input type="date" className="createlisting" name="date"  value={removeDate} onChange={e => setRemoveDate(e.target.value)}/>
                        <div>
                            <Button onClick={handleRemoveAvailability} className="createlisting">Remove Listing</Button>
                        </div>
                        {
                            availabilities.length > 0 && availabilities.map(e => <div>{e}</div>)
                        }
                    </div>
                </div>
                <div style={{border: "1px solid black", margin: '1%'}}>
                    <div className="headerSearchItem" style={{padding: '2%'}}>
                            <h2>Update Pricing</h2>
                            <input type="date" className="createlisting" name="date"  value={updatePriceDate} onChange={handleUpdatePriceDateChange}/>
                            <input type="number" className="createlisting" placeholder="Listing Price" value={updatePrice}
                                   name="price" onChange={e => setUpdatePrice(e.target.value)}/>
                            <input type="number" className="createlisting" placeholder="Listing Adjusted Price" value={updateAdjPrice}
                                   name="adjPrice" onChange={e => setUpdateAdjPrice(e.target.value)}/>
                            <div>
                                <Button onClick={handleUpdatePricing} className="createlisting">Update Pricing</Button>
                            </div>
                    </div>

                </div>

                <div style={{border: "1px solid black", margin: '1%'}}>

                    <div style={{textAlign: "right", fontSize: "14px"}}>
                        <div style={{paddingRight: "40%"}}>
                            <div>
                                Listing name
                                <input type="text" name="listingName" className="createlisting" placeholder="Listing Name" value={listingName}
                                       onChange={e => setListingName(e.target.value)} disabled/>
                            </div>
                            <div>
                                Listing Description
                                <input type="textarea" name="listingDescription" className="createlisting"
                                       placeholder="Listing Description" value={listingDescription}
                                       onChange={e => setListingDescription(e.target.value)} disabled/>
                            </div>
                            <div>
                                Listing License
                                <input type="text" name="listingLicense" className="createlisting" placeholder="Listing License"
                                       value={listingLicense}
                                       onChange={e => setListingLicense(e.target.value)}/>
                            </div>
                            <div>
                                <Button onClick={handleSubmit} className="createlisting"  style={{marginRight: "15%"}}>Update License</Button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div style={{maxWidth: "100%", display: "inline-block", margin: "2%"}}>
            {
                reviews != null && reviews.map(e => <ReviewCard key={e.reviewId} e={e}></ReviewCard>)
            }
            </div>
        </>
    );


};

export default ManageListing;
