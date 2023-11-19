import React from "react";
import { Link } from "react-router-dom";
import routeImage from "../img/route.svg";
import homeImage from "../img/home.svg";
import cctvImage from "../img/cctv.svg";
const MenuBar = () => {
  return (
    <div className="menu-bar">
      <div className="logo">Safety Route</div>
      <Link className="menu-button" to="/">
        {" "}
        <img src={homeImage} alt="Route" width="20" height="20" />
        <div className="menu-button-content">
          <span>검색</span>
        </div>
      </Link>
      <Link
        className="menu-button"
        to="/direction  "
        style={{ borderColor: "#03c75a", background: "#e8e8ea" }}
      >
        <img src={routeImage} alt="Route" width="20" height="20" />
        <div className="menu-button-content">
          <span>길찾기</span>
        </div>
      </Link>
      <Link
        className="menu-button"
        to="/cctv"
        style={{ borderColor: "#a0adb2" }}
      >
        <img src={cctvImage} alt="Route" width="20" height="20" />
        <div className="menu-button-content">
          <span>CCTV</span>
        </div>
      </Link>
    </div>
  );
};
export default MenuBar;
