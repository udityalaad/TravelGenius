import React, { useState, useEffect } from "react";

import Navbar from "../../components/navbar/Navbar";
import isAuthenticated from "../../utils/IsAuthenticated";
import {useNavigate} from "react-router-dom";
import getReservedCalendarByUserId from "../../API/GetReservedCalendarByUserId";
import AddReview from "../../API/AddReview";

function BookingsCard(props) {
    const bookings = props.bookings.slice(1, props.bookings.length + 1)
    const userId = localStorage.getItem("ece656_userid")
    const listingId = bookings[0][0].listingId;
    const [review, setReview] = useState('');
    const shouldDisplay = (date) => {
        const currentDate = new Date();
        const compareDate = new Date(date);
        if (compareDate.getTime() > currentDate.getTime()) {
            return !props.past;
        } else {
            return props.past;
        }
    }
    const submitReview = async (e) => {
        if(review == null || review === undefined || review === ''){
            alert("Enter valid value for review");
        }
        const payload = {
            "reviewerId": userId,
            "listingId": listingId,
            "reviewComments": review
        }

        const response = await AddReview(payload);
        if(response != null && response.message === "Insert Sucessful"){
            alert("Thank you for the review!")
            setReview('')
        } else {
            alert(response.message)
        }
    }

    const containsDates = () => {
        return bookings.length > 0 && bookings[0].length > 0 && bookings[0].filter(e => shouldDisplay(e.listingCalendar_Date)).length > 0
    }

    return <>
        {
            containsDates() && listingId != null && <div className="bookingcard-wrapper">
                {
                    bookings.length > 0 && bookings[0].length > 0 &&
                    <>{bookings[0][0].listingName}</>
                }
                {
                    bookings.length > 0 && bookings[0].length > 0 &&
                    bookings[0].filter(e => shouldDisplay(e.listingCalendar_Date)).map(e => <div key={e.listingCalendar_Date}>
                            <div style={{border: "1px solid lightblue", margin: "1%"}}>
                                {e.listingCalendar_Date.substring(0, 10)} ${e.listingCalendar_Price}
                            </div>
                    </div>)
                }
                {
                    <div>
                        <input type="text" placeholder="Write Review" onChange={e => setReview(e.target.value)}/>
                        <button onClick={submitReview}> Submit Review</button>
                    </div>
                }
            </div>
        }

    </>
}
const NewBookings = ({props}) => {
    const navigate = useNavigate(); // Example for login
    const userId = localStorage.getItem("ece656_userid");
    const [reservations, setReservation] = useState(new Map());

    React.useEffect(() => {
        const loggedIn = isAuthenticated();
        if (!loggedIn) {
            navigate("/login")
        }
    })

    useEffect( () => {
        const fetchReservation = async () => {
            const result = await getReservedCalendarByUserId(userId);
            const newMap = new Map();
            result.reservedCalendars.map(e => newMap.set(e.listingId, []))
            result.reservedCalendars.map(e => newMap.set(e.listingId, [...newMap.get(e.listingId), e]))
            setReservation(newMap)
        }
        fetchReservation();
    }, [])

    return (
        <div>
            <Navbar openTab="newbookings" />
            <div style={{margin: "1%"}}>
            <h2>Future Bookings</h2>
            <div style={{width: "100%", position: "relative"}}>
                {
                    reservations.size > 0 &&
                    (Array.from(reservations)).map(e => <BookingsCard key={e[0]+""+e.listingCalendar_Date+""+e.paymentId} bookings={e} past={false}>
                    </BookingsCard>)
                }
            </div>
            </div>
        </div>
    );


};

export default NewBookings;
