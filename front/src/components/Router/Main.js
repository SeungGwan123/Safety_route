import React from 'react';
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import "leaflet/dist/leaflet.css"
import "../styles/style.scss";


function Main() {

  return (
    <div className='main'>
          <MapContainer center={[37.5665, 126.9780]} zoom={15} scrollWheelZoom={true} style={{ width: "100%", height: "100vh" }}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[37.5665, 126.9780]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
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
     
        <input className='input-address'
          type="text"
          placeholder="주소를 입력하세요!"
        />
        <div className='Search' ></div>
        </div>
        
      </div>
    </div>

  )
  
}

export default Main;
