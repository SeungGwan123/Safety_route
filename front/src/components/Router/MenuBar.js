import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import routeImage from "../img/route.svg";
import homeImage from "../img/home.svg";
import cctvImage from "../img/cctv.svg";

const menuItems = [
  { path: "/", label: "검색", image: homeImage, borderColor: "#258fff" },
  {
    path: "/direction",
    label: "길찾기",
    image: routeImage,
    borderColor: "#03c75a",
  },
  { path: "/cctv", label: "CCTV", image: cctvImage, borderColor: "#a0adb2" },
];

const MenuBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleButtonClick = (path) => {
    setActiveLink(path);
    // Check if the path is "/direction" before reloading
    if (path === "/direction") {
      navigate("/direction");
      window.location.reload();
    } 
  };

  return (
    <div className="menu-bar">
      <div className="logo">Safety Route</div>
      {menuItems.map((item, index) => (
        <Link
          key={index}
          className={`menu-button ${activeLink === item.path ? "active" : ""}`}
          to={item.path}
          onClick={() => handleButtonClick(item.path)}
          style={{
            borderColor: item.borderColor,
            background: activeLink === item.path ? "#e8e8ea" : "#ffffff",
          }}
        >
          <img src={item.image} alt={item.label} width="20" height="20" />
          <div className="menu-button-content">
            <span>{item.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuBar;
