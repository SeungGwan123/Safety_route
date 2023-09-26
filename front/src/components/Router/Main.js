import React, { useState, useRef,useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from "leaflet";
import { Link } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import "../styles/style.scss";
import axios from "axios";

function Main() {
  // axios.get("http://127.0.0.1:5000/route/v1/driving/127.092088,37.335339;127.085124,37.337822?steps=true").then(function (res){
  //   console.log(res.data)
  // })
  

  const addressCoordinates = {
    '아카데미로 119': { lat: 37.375924147295455, lng: 126.63285162967031 }, // Replace with your own dataset
    '송도 타임스페이스': { lat: 37.38308798021501, lng: 126.64251548843 },
    '서울':{ lat: 37.5665, lng: 126.9780 }
    // Add more addresses and coordinates as needed
  };

  const [address, setAddress] = useState("");
  const [markerPosition, setMarkerPosition] = useState([37.5665, 126.9780]);
  const mapRef = useRef();

  const searchAddress = () => {
    const coordinates = addressCoordinates[address];

    if (coordinates) {
      const { lat, lng } = coordinates;
      if (mapRef.current) {
        // Set the view of the TileLayer (OSM) to the new coordinates
        mapRef.current.setView([lat, lng], 15);
        setMarkerPosition([lat, lng]);
      }
    } else {
      console.error("Address not found in the dataset.");
    }
  }

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
            여기는 서울입니다 <br /> 위도:37.5665 경도:126.9780 <br/>도로명: 서울 중구 세종대로 110 서울특별시청<br/>
            지번: 태평로1가 31<br/>
            우편번호: 04524
          </Popup>  
        </Marker>
      </MapContainer>
      <div className='menu-bar'>
      <Link className='logo'>로고</Link>
      <Link className='menu-button' style={{background:"#258fff", color:"#fff"}} to="/">검색</Link>
      <Link className='menu-button' to="/direction">길찾기</Link>
      <Link className='menu-button' to="/cctv">CCTV</Link>
      </div>
      <div className="menu">
        <div className='nav'>
          <input
            className='input-address'
            type="text"
            placeholder="주소를 입력하세요!"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className='Search' onClick={searchAddress}></div>
        </div>
      </div>
    </div>
  )
}

export default Main;
