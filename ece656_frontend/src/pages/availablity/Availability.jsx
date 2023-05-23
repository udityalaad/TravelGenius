import "./availability.css";
import {useNavigate, useParams,} from "react-router-dom";
import React, {useState, useEffect} from "react";
import GetReviewByListingID from "../../API/GetReviewByListingId";
import GetCalendarByListingId from "../../API/GetCalendarByListingId";
import {ReviewCard} from "../../components/reviewCard/ReviewCard";
import Navbar from "../../components/navbar/Navbar";
import MakeReservation from "../../API/MakeReservation";
import MakePayment from "../../API/MakePayment";
import GetCustomer from "../../API/GetCustomer";

function DateComponent(props) {
    const [isSelected, setIsSelected] = useState(false)
    const date = props.date.listingCalendar_Date.substring(0, 10);

    const handleClickOnDate = (e) => {
        let selectedDate = props.selectedDate;
        if (isSelected) {
            props.setCost(Number(props.cost) - Number(props.date.listingCalendar_AdjustedPrice))
            selectedDate.splice(selectedDate.indexOf(date), 1);
        } else {
            props.setCost(Number(props.cost) + Number(props.date.listingCalendar_AdjustedPrice))
            selectedDate.push(date);
        }
        props.setSelectedDate(selectedDate)
        setIsSelected(!isSelected)
    }

    if(!date.includes(props.currentMonth)){
        return <></>
    }else{
        return <div className={"dateCircularButton"} >
                {
                    props.date.listingCalendar_isAvailable == 1 && <>
                        <button onClick={handleClickOnDate} className={isSelected ? "selected" : ""} style={{width:'200px', height: '70px'}}>
                            <div> {isSelected && <>&#10003;</>} Price: {props.date.listingCalendar_Price}</div>
                            <div>Adjusted Price: {props.date.listingCalendar_AdjustedPrice}</div>
                            <div>{date}</div>
                        </button>
                    </>
                }
                {
                    props.date.listingCalendar_isAvailable == 0 && <>
                        <button style={{width:'200px', background: 'lightgray', height: '70px'}}>
                            <div>Not Available For</div>
                            <div>{date}</div>
                        </button>
                    </>
                }
        </div>;
    }

}


function CalendarView(props) {
    return <div style={{width: "100%", float: 'left'}}>
        {
            props.calendar != null && props.calendar.map(e =>
                <DateComponent date={e}
                               setSelectedDate={props.setSelectedDate}
                               selectedDate={props.selectedDate}
                               key={e.listingCalendar_Date}
                               currentMonth={props.currentMonth}
                               setCost={props.setCost}
                               cost={props.cost}
                ></DateComponent>)
        }
    </div>
}

const Availability = ({props}) => {
    const {id: listingid} = useParams();
    const [reviews, setReviews] = useState([]);
    const [calendar, setCalendar] = useState([]);
    const [selectedDate, setSelectedDate] = useState([]);
    const [currentMonth, setCurrentMonth] = useState('2023-04-')
    const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
    const [cost, setCost] = useState([]);
    const customerId = parseInt(localStorage.getItem("ece656_userid"));
    const navigate = useNavigate();
    const [interacEmail, setInteracEmail] = useState('');


    const getNextMonth = () => {
        let _year = parseInt(currentMonth.substring(0, 4))
        let _month = parseInt(currentMonth.substring(5, 7))
        _month = _month + 1
        if(_month > 12){
            _year = _year + 1
            _month = 1
        }
        _month = ("0" + _month).slice(-2)
        let nextMonth = _year + "-" + _month + "-";
        setCurrentMonth(nextMonth)
    }

    const getPreviousMonth = () => {
        let _year = parseInt(currentMonth.substring(0, 4))
        let _month = parseInt(currentMonth.substring(5, 7))
        _month = _month - 1
        if(_month === 0){
            _year = _year - 1
            _month = 12
        }
        _month = ("0" + _month).slice(-2)
        let nextMonth = _year + "-" + _month + "-";
        setCurrentMonth(nextMonth)
    }

    const handleGetReview = async () => {
        if (listingid != null) {
            const _reviews = await GetReviewByListingID(listingid);
            setReviews(_reviews.reviews);
        }
    }

    const handleConfirmBooking = async () => {
        const customer = (await GetCustomer(customerId));
        if(customer.message !== "Found Successfully"){
            alert(customer.message)
            return;
        }
        if(interacEmail == null || interacEmail == undefined || interacEmail.length < 1){
            alert("Please Enter valid information.")
            return;
        }
        const payment = await MakePayment({
            interacId: interacEmail,
            paymentStatus: 'Completed'
        });

        let err = false;
        for(let i = 0; i < selectedDate.length; i++){
            const response = await MakeReservation({
                listingId: listingid,
                listingCalendar_Date: selectedDate[i],
                customerId: customerId,
                paymentId: payment.paymentId
            })

            if(response != null && response.message === "Insert Sucessful"){
            } else {
                err = response.message;
                alert(response.message)
            }
        }
        if(err === false){
            alert("Booking Confirmed")
            navigate("/bookings")
        } else {
            alert(err)
        }
        setSelectedDate([])
    }

    const handleSubmit = async () => {
        if(selectedDate.length < 1){
            alert("Please select at least one date")
            return;
        }
        setIsWaitingForPayment(!isWaitingForPayment);
        setReviews([]);
    }

    const handleBackToSelection = async () => {
        setIsWaitingForPayment(!isWaitingForPayment);
        setReviews([]);
    }

    useEffect(() => {
        const fetchData = async () => {
            const _calendar = await GetCalendarByListingId(listingid);
            setCalendar(_calendar.listingCalendars);
        }

        fetchData()
            .catch(console.error);
    }, [listingid])

    return (
        <div className="container">
            <Navbar openTab="stays" />
            <div style={{width: '95%', margin: 'auto', display: (isWaitingForPayment ? 'none': '')}}>
                <button onClick={getPreviousMonth} className="navigate">Prev</button>
                <button onClick={getNextMonth} className="navigate">Next</button>
                <CalendarView calendar={calendar} selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                              currentMonth={currentMonth} setCost={setCost} cost={cost}></CalendarView>
            </div>
            <div style={{display: (isWaitingForPayment ? 'none': '')}}>
                <button onClick={handleSubmit} className="navigate">Continue to Booking</button>
            </div>
            <div style={{display: (isWaitingForPayment ? '': 'none')}}>
                Selected Dates are:
                {
                    selectedDate != null && selectedDate.map(e => <div key={e}>{e}</div>)
                }
                <div>
                    Total Cost would be: {cost} CAD
                </div>
                <div>
                    <input type="email" name="interacEmail" className="signup" placeholder="Interac Email Id"
                           onChange={e => setInteracEmail(e.target.value)}/>
                </div>
                <button onClick={handleBackToSelection} className="navigate">Back to date Selection</button>
                {
                    selectedDate.length > 0 && <>
                        <button onClick={handleConfirmBooking} className="navigate">Confirm booking</button>
                    </>
                }
            </div>
            <button className="siCheckButton navigate" onClick={handleGetReview}>Get Reviews</button>
            <div style={{maxWidth: "100%"}}>
                {
                    reviews != null && reviews.map(e => <ReviewCard key={e.reviewId} e={e}></ReviewCard>)
                }
            </div>
        </div>
    );


}

export default Availability;