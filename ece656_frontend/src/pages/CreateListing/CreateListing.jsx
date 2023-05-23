import React, {useState, useEffect} from "react";

import "./createListing.css";
import Navbar from "../../components/navbar/Navbar";
import isAuthenticated from "../../utils/IsAuthenticated";
import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import AddNewListing from "../../API/AddNewListing";

const roomTypes = ['Shared room', 'Private room', 'Hotel room', 'Entire home/apt'];
const bathroomTypes = ['bath', 'shared half bath', 'shared bath', 'half bath', 'private half bath', 'private bath'];
const propertyTypes = ['Barn', 'Boat', 'Camper/RV', 'Campsite', 'Casa particular',
    'Castle',
    'Cave',
    'Dome',
    'Earthen home',
    'Entire bed and breakfast',
    'Entire bungalow',
    'Entire cabin',
    'Entire chalet',
    'Entire condo',
    'Entire cottage',
    'Entire guest suite',
    'Entire guesthouse',
    'Entire home',
    'Entire home/apt',
    'Entire loft',
    'Entire place',
    'Entire rental unit',
    'Entire serviced apartment',
    'Entire timeshare',
    'Entire townhouse',
    'Entire vacation home',
    'Entire villa',
    'Farm stay',
    'Floor',
    'Island',
    'Private room',
    'Private room in barn',
    'Private room in bed and breakfast',
    'Private room in boat',
    'Private room in bungalow',
    'Private room in cabin',
    'Private room in camper/rv',
    'Private room in casa particular',
    'Private room in castle',
    'Private room in chalet',
    'Private room in condo',
    'Private room in cottage',
    'Private room in dome',
    'Private room in earthen home',
    'Private room in farm stay',
    'Private room in floor',
    'Private room in guest suite',
    'Private room in guesthouse',
    'Private room in home',
    'Private room in hostel',
    'Private room in hut',
    'Private room in island',
    'Private room in loft',
    'Private room in nature lodge',
    'Private room in rental unit',
    'Private room in resort',
    'Private room in serviced apartment',
    'Private room in tent',
    'Private room in tiny home',
    'Private room in townhouse',
    'Private room in vacation home',
    'Private room in villa',
    'Religious building',
    'Room in aparthotel',
    'Room in bed and breakfast',
    'Room in boutique hotel',
    'Room in hostel',
    'Room in hotel',
    'Room in serviced apartment',
    'Shared room',
    'Shared room in bed and breakfast',
    'Shared room in boat',
    'Shared room in bungalow',
    'Shared room in camper/rv',
    'Shared room in condo',
    'Shared room in guest suite',
    'Shared room in guesthouse',
    'Shared room in home',
    'Shared room in hostel',
    'Shared room in loft',
    'Shared room in parking space',
    'Shared room in rental unit',
    'Shared room in townhouse',
    'Shared room in vacation home',
    'Shared room in villa',
    'Shipping container',
    'Tent',
    'Tiny home',
    'Tipi',
    'Tower',
    'Train',
    'Treehouse',
    'Yurt']

const CreateListing = ({props}) => {
    const navigate = useNavigate(); // Example for login
    const hostid = localStorage.getItem("ece656_userid");
    const userrole = localStorage.getItem("ece656_role");
    const [listingName, setListingName] = useState('');
    const [listingDescription, setListingDescription] = useState('');
    const [listingPictureUrl, setListingPictureUrl] = useState('');
    const [listingLicense, setListingLicense] = useState('');
    const [listingInstantBookable, setListingInstantBookable] = useState('1');
    const [propertyType, setPropertyType] = useState(propertyTypes[0]);
    const [roomType, setRoomType] = useState(roomTypes[0]);
    const [bathroomType, setBathroomType] = useState(bathroomTypes[0]);
    const [accommodates, setAccommodates] = useState(5);
    const [propertyCoordinatesX, setPropertyCoordinatesX] = useState(10);
    const [propertyCoordinatesY, setPropertyCoordinatesY] = useState(10);
    const [noOfBathRooms, setNoOfBathrooms] = useState(10);

    React.useEffect(() => {
        const loggedIn = isAuthenticated();
        if (!loggedIn) {
            navigate("/login")
        }
    })

    const handleSubmit = async () => {
        const mandatoryFields = [listingPictureUrl, listingInstantBookable, hostid, bathroomType, propertyType, roomType, accommodates,
            propertyCoordinatesX, propertyCoordinatesY];
        for(let i = 0; i < mandatoryFields.length; i++){
            if(mandatoryFields[i] == null || mandatoryFields[i] == undefined || mandatoryFields[i].length < 1){
                alert("Please Enter Valid value.")
                return;
            }
        }
        const payload = {
            "listingName": listingName,
            "listingDescription": listingDescription,
            "listingLicense": listingLicense,
            "listingPictureUrl": listingPictureUrl,
            "listingInstantBookable": listingInstantBookable,
            "hostid": hostid,
            "propertyType": propertyType,
            "roomType": roomType,
            "bathroomType": bathroomType,
            "accommodates": accommodates,
            "noOfBathrooms": noOfBathRooms,
            "propertyCoordinates": {
                "x": propertyCoordinatesX,
                "y": propertyCoordinatesY
            },
            "hostId": hostid
        }
        const response = await AddNewListing(payload);
        if(response != null && response.message === "Insert Sucessful"){
            alert("Listing has been added Successfully !")
            navigate("/mylistings")
        } else {
            alert(response.message);
        }
    }

    return (
        <div style={{textAlign: "right", fontSize: "14px"}}>
            <Navbar openTab="newlisting"/>
            <div style={{paddingRight: "40%"}}>
                <div>
                    Listing name
                    <input type="text" name="listingName" className="createlisting" placeholder="Listing Name"
                           onChange={e => setListingName(e.target.value)}/>
                </div>
                <div>
                    Listing Description
                    <input type="textarea" name="listingDescription" className="createlisting"
                           placeholder="Listing Description"
                           onChange={e => setListingDescription(e.target.value)}/>
                </div>
                <div>
                    Listing Picture URL
                    <input type="text" name="listingPictureURL" className="createlisting"
                           placeholder="Listing Picture URL"
                           onChange={e => setListingPictureUrl(e.target.value)}/>
                </div>
                <div>
                    Listing Instant Bookable
                    <select type="text" name="listingInstantBookable" className="createlisting"
                            placeholder="Is Listing instant bookable"
                            onChange={e => {
                                console.log(e.target.value)
                                setListingInstantBookable(e.target.value);
                            }}>
                        <option value={'1'}>Yes</option>
                        <option value={'0'}>No</option>
                    </select>
                </div>
                <div>
                    Listing License
                    <input type="text" name="listingLicense" className="createlisting" placeholder="Listing License"
                           onChange={e => setListingLicense(e.target.value)}/>
                </div>
                <div>
                    Property Type
                    <select type="text" name="propertyType" className="createlisting" placeholder="Property Type"
                           onChange={e => setPropertyType(e.target.value)}>
                        {
                            propertyTypes.map(option => (
                                <option value={option} key={option}>{option}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    Room Type
                    <select type="text" name="roomType" className="createlisting" placeholder="Room Type"
                           onChange={e => setRoomType(e.target.value)}>
                        {
                            roomTypes.map(option => (
                                <option value={option} key={option}>{option}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    Bathroom Type
                    <select type="text" name="bathroomType" className="createlisting" placeholder="Bathroom Type"
                           onChange={e => setBathroomType(e.target.value)}>
                        {
                            bathroomTypes.map(option => (
                                <option value={option} key={option}>{option}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    No Of Bathrooms
                    <input type="number" name="noOfBathrooms" className="createlisting"
                           onChange={e => setNoOfBathrooms(e.target.value)}/>
                </div>
                <div>
                    Capacity
                    <input type="number" name="accommodates" className="createlisting"
                           onChange={e => setAccommodates(e.target.value)}/>
                </div>
                <div>
                    Property Coordinates X:
                    <input type="number" name="propertyCoordinatesX" className="createlisting" style={{width: "9%"}}
                           onChange={e => setPropertyCoordinatesX(e.target.value)}/>
                    Y:
                    <input type="number" name="propertyCoordinatesX" className="createlisting" style={{width: "9.5%"}}
                           onChange={e => setPropertyCoordinatesY(e.target.value)}/>
                </div>


                <div>
                    <Button onClick={handleSubmit} className="createlisting"  style={{marginRight: "15%"}}>Add New Listing</Button>
                </div>
            </div>
        </div>
    );


};

export default CreateListing;
