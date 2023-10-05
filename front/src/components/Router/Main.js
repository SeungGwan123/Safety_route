import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from "leaflet";
import { Link } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import "../styles/style.scss";
import axios from "axios";
import routeImage from "../img/route.svg";
import homeImage from "../img/home.svg";
import cctvImage from "../img/cctv.svg";

function Main() {
  const Nominatim_Base_Url = "https://nominatim.openstreetmap.org/search";

  const [address, setAddress] = useState("");
  const [markerPosition, setMarkerPosition] = useState([37.5665, 126.9780]);
  const mapRef = useRef();

  const searchAddress = async () => {
    try {
      const response = await axios.get(Nominatim_Base_Url, {
        params: {
          q: address,
          format: 'json',
          addressdetails: '1',
        },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        if (mapRef.current) {
          mapRef.current.setView([lat, lon], 15);
          setMarkerPosition([lat, lon]);
        }
      } else {
        console.error("Address not found.");
      }
    } catch (error) {
      console.error("Error searching for address:", error);
    }
  };

  const customIcon = new L.Icon({
    iconUrl: require("../img/search.png"), // 이미지 경로를 올바르게 지정하세요.
    iconSize: [20, 24],
    iconAnchor: [12, 24],
  });

  return (
    <div className='main'>
      <div className='login'>로그인</div>
      <MapContainer center={[37.5665, 126.9780]} zoom={15} scrollWheelZoom={true} style={{ width: "100%", height: "100vh" }} ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={markerPosition} icon={customIcon}>
          <Popup>
            여기는 서울입니다 <br /> 위도: 37.5665 경도: 126.9780 <br />도로명: 서울 중구 세종대로 110 서울특별시청<br />
            지번: 태평로1가 31<br />
            우편번호: 04524
          </Popup>
        </Marker>
      </MapContainer>
      <div className='menu-bar'>
        <Link className='logo'>로고</Link>
        <Link className='menu-button' style={{ background: "#258fff", color: "#fff" }} to="/"><div className="menu-button-content">
        <img src={homeImage} alt="Route" />
        <span>검색</span>
      </div></Link>
        <Link className='menu-button' to="/direction"><div className="menu-button-content">
        <img src={routeImage} alt="Route" />
        <span>길찾기</span>
      </div></Link>
        <Link className='menu-button' to="/cctv"><div className="menu-button-content">
        <img src={cctvImage} alt="Route" />
        <span>CCTV</span>
      </div></Link>
      </div>
      <div className="menu">
        <div className='nav'>
          <input
            className='input-address'
            type="text"
            placeholder="주소를 입력하세요!"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                searchAddress();
              }
            }}
          />
          <div className='Search' onClick={searchAddress}></div>
        </div>
      </div>
    </div>
  )
}

export default Main;
