import {
    faBed,
    faCalendarDays,
    faCar,
    faPerson,
    faPlane,
    faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./header.css";
import {DateRange} from "react-date-range";
import {useState} from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import {format} from "date-fns";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import {DateRangePicker} from 'react-date-range';

const Header = ({
                    setOpenDate,
                    openDate,
                    setDate,
                    date,
                    type,
                    handleSearch,
                    setPosX,
                    setPosY,
                    setMinBeds,
                    setMaxBeds,
                    setMinPrice,
                    setMaxPrice,
                    setRange
                }) => {

    const [selectedCoords, setSelectedCoords] = useState(null);

    const handleMapClick = (e) => {
        console.log(e.latlng)
        // setSelectedCoords(e.latlng);
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: handleMapClick,
        });
        return null;
    };

    return (
        <>
            <div className="header">
                <div
                    className={
                        type === "list" ? "headerContainer" : "headerContainer"
                    }
                >
                    {type !== "list" && (
                        <div style={{float: "left"}}>
                            <button className="headerBtn">Sign in / Register</button>
                            <div className="headerSearch">
                                <div className="headerSearchItem">
                                    <FontAwesomeIcon icon={faCalendarDays} className="headerIcon"/>
                                    <span
                                        onClick={() => setOpenDate(!openDate)}
                                        className="headerSearchText"
                                    >{`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
                                        date[0].endDate,
                                        "MM/dd/yyyy"
                                    )}`}</span>
                                    {openDate && (
                                        <DateRangePicker
                                            editableDateInputs={true}
                                            onChange={(item) => setDate([item.selection])}
                                            moveRangeOnFirstSelection={false}
                                            ranges={date}
                                            className="date"
                                            minDate={new Date()}
                                        />
                                    )}
                                </div>
                                <div className="headerSearchItem">
                                    Location X:
                                    <input type="number" onChange={(e) => setPosX(e.target.value)}/>
                                    Y:
                                    <input type="number" onChange={(e) => setPosY(e.target.value)}/>
                                </div>
                                <div className="headerSearchItem">
                                    Min Bedrooms:
                                    <input type="number" onChange={(e) => setMinBeds(e.target.value)}/>
                                    Max Bedrooms:
                                    <input type="number" onChange={(e) => setMaxBeds(e.target.value)}/>
                                </div>
                                <div className="headerSearchItem">
                                    Radius (km):
                                    <input type="number" onChange={(e) => setRange(e.target.value)}/>
                                </div>
                                <div className="headerSearchItem">
                                    Min Price ($):
                                    <input type="number" onChange={(e) => setMinPrice(e.target.value)}/>
                                    Max Price ($):
                                    <input type="number" onChange={(e) => setMaxPrice(e.target.value)}/>
                                </div>
                                <div className="headerSearchItem">
                                    <button className="headerBtn" onClick={handleSearch}>
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/*<label htmlFor="coordinates">Coordinates:</label>*/}
            {/*/!*<input id="coordinates" name="coordinates" type="text" value={coords ? `${coords.lat}, ${coords.lng}` : ''} />*!/*/}
            {/*<MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} style={{height: '40px'}}>*/}
            {/*    <TileLayer*/}
            {/*        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"*/}
            {/*        attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'*/}
            {/*    />*/}
            {/*    <MapClickHandler/>*/}
            {/*    {selectedCoords && (*/}
            {/*        <Marker position={selectedCoords}>*/}
            {/*            <Popup>*/}
            {/*                <span>You selected coordinates: {selectedCoords.toString()}</span>*/}
            {/*            </Popup>*/}
            {/*        </Marker>*/}
            {/*    )}*/}
            {/*</MapContainer>*/}

        </>

    );
};

export default Header;
