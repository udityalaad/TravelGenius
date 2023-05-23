import "./navbar.css"
import React from 'react';
import { useNavigate } from "react-router-dom";

import {
  faBed,
  faCalendarDays, faFeed, faHollyBerry, faList, faPerson
} from "@fortawesome/free-solid-svg-icons";

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Navbar = ({ openTab }) => {
  const role = localStorage.getItem("ece656_role")
  const userId = localStorage.getItem("ece656_userid")
  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem("ece656_role");
    localStorage.removeItem("ece656_userid");
    alert("Successfully logged out.")
    navigate("/login")
  }


  return (
    <div className="navbar">
      <div className="navContainer">
        <span className="logo">ECE 656</span>
        <div className="headerList">
          { role === 'customer' &&
            (<>
              <div className={`headerListItem ${openTab === "stays" ? 'active' : ''}`}>
                <Link to="/" className="tabs">
                  <FontAwesomeIcon icon={faBed}/>
                  <span>Stays</span>
                </Link>
              </div>
              <div className={`headerListItem ${openTab === "bookings" ? 'active' : ''}`}>
                <Link to="/bookings" className="tabs">
                  <FontAwesomeIcon icon={faCalendarDays} />
                  <span>Past Bookings</span>
                </Link>
              </div>
              <div className={`headerListItem ${openTab === "newbookings" ? 'active' : ''}`}>
                <Link to="/newbookings" className="tabs">
                  <FontAwesomeIcon icon={faCalendarDays} />
                  <span>Future Bookings</span>
                </Link>
              </div>
              <div className={`headerListItem ${openTab === "profile" ? 'active' : ''}`}>
                <Link to="/updateprofile" className="tabs">
                  <FontAwesomeIcon icon={faPerson}/>
                  <span>Profile</span>
                </Link>
              </div>
              </>)
          }
          { role === 'host' &&
              (<>
                <div className={`headerListItem ${openTab === "newlisting" ? 'active' : ''}`}>
                  <Link to="/createnewlisting" className="tabs">
                    <FontAwesomeIcon icon={faCalendarDays} />
                    <span>New Listing</span>
                  </Link>
                </div>
                <div className={`headerListItem ${openTab === "profile" ? 'active' : ''}`}>
                  <Link to="/updatehostprofile" className="tabs">
                    <FontAwesomeIcon icon={faPerson}/>
                    <span>Profile</span>
                  </Link>
                </div>
                <div className={`headerListItem ${openTab === "mylistings" ? 'active' : ''}`}>
                  <Link to="/mylistings" className="tabs">
                    <FontAwesomeIcon icon={faList}/>
                    <span>My Listings</span>
                  </Link>
                </div>
              </>)
          }
        </div>

        <div className="navItems">
          {userId}
          <button className="navButton">{role}</button>
          <button className="navButton" onClick={() => handleLogOut()}>Log out</button>
        </div>

      </div>
    </div>
  )
}

export default Navbar