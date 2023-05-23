import "./listingCard.css";
import {Link} from "react-router-dom";

// TODO: (Nirav)
export function ListingCard(props) {
    return (<>
        {
            props != null && props.e != null &&
            props.e.listingPictureUrl &&
            <div className="searchItem">
                <img
                    src={props.e.listingPictureUrl}
                    alt=""
                    className="siImg"
                />
                <div className="siDesc">
                    <h1 className="siTitle">{props.e.listingName}</h1>
                    <span className="siDistance">{props.e.listingDescription}</span>
                    {/*<span className="siTaxiOp">Free airport taxi</span>*/}
                    <span className="siSubtitle">
                        {props.e.propertyType}
                    </span>
                    <span className="siFeatures">
                        {props.e.roomType} {props.e.noBathrooms} {'Bathrooms'} {props.e.noBeds} {'Beds'}
                    </span>
                    <span className="siCancelOp">
                        x: {props.e.propertyCoordinates.x} y: {props.e.propertyCoordinates.y}
                    </span>
                    <span className="siCancelOpSubtitle">
                        {props.e.propertyNeighborhood}
                    </span>
                    <span className="siCancelOpSubtitle">
                        {props.e.propertyNeighborhoodOverview}
                    </span>
                </div>
                <div className="siDetails">
                    <div className="siDetailTexts">
                        <span className="siPrice">${props.e.listingCalendar_Price}</span>
                        <span className="siTaxOp">Includes taxes and fees</span>
                        <Link to={"/availability/" + props.e.listingId} state={{ id: props.e.listingId}}>
                            <button className="siCheckButton">See availability</button>
                        </Link>
                    </div>
                </div>
            </div>
        }
    </>);
}
