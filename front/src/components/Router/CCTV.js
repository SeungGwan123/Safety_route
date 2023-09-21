import React, { useState, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Circle } from 'react-leaflet';
import L from "leaflet";
import { Link } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import "../styles/style.scss";
import axios from "axios";

function CCTV() {
  const addressCoordinates = {
    '아카데미로 119': { lat: 37.375924147295455, lng: 126.63285162967031 }, // Replace with your own dataset
    '송도 타임스페이스': { lat: 37.38308798021501, lng: 126.64251548843 },
    '서울':{ lat: 37.5665, lng: 126.9780 }
    // Add more addresses and coordinates as needed
  };
  const cctvCoordinates=[
    [37.570864,127.003371],
    [37.570881,127.004878],
    [37.571567,127.010944],
    [37.571653,127.01308],

    [37.581843,127.002123],//16
    [37.570764,126.975918],
    [37.585041,126.982137],
    [37.576877,127.002369],

    [37.5835,127.002609],//25
    [37.582667,127.003884],
    [37.572498,126.991473],
    [37.57142,126.980701],

    [37.583035,126.998637],//31
    [37.569998,126.975498],
    [37.572226,127.013539],
    [37.574936,126.967743]

]

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
  const cctvIcon = new L.Icon({
    iconUrl: require("../img/cctv.png"), // 이미지 경로를 올바르게 지정하세요.
    iconSize: [15, 20],
    iconAnchor: [16, 21],
  });
  return (
    <div className='main'>
      <MapContainer center={[37.5665, 126.9780]} zoom={15} scrollWheelZoom={true} style={{ width: "100%", height: "100vh" }} ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={markerPosition} icon={customIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>  
        </Marker>
        {cctvCoordinates.map((coordinates, index) => (
  <Marker key={index} position={coordinates} icon={cctvIcon}>
    <Popup>
    관리기관명: 서울특별시 종로구청<br/>
    소재지도로명주소: 새문안로 55 경희궁공원 쉼터<br/>
    소재지지번주소: "신문로2가 2-1, 흥화문 근처 쉼터<br/>
    설치목적구분: 생활방범<br/>
    카메라대수: 1, <br /> 
    촬영방면정보: 360도전방면
    </Popup>  
  </Marker>
))}

      </MapContainer>
      <div className='menu-bar'>
      <Link className='logo'>로고</Link>
      <Link className='menu-button'  to="/">검색</Link>
      <Link className='menu-button' to="/direction">길찾기</Link>
      <Link className='menu-button' style={{background:"#258fff", color:"#fff"}} to="/cctv">CCTV</Link>
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

export default CCTV;
