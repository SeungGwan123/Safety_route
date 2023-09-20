import "../styles/style.scss";
import React, { useEffect,useState, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from "leaflet";

function Direction(){
  const customIcon = new L.Icon({
    iconUrl: require("../img/search.png"), // 이미지 경로를 올바르게 지정하세요.
    iconSize: [20, 24],
    iconAnchor: [12, 24],
  });
  const mapRef=useRef();

    
    const routeCoordinates = [
      [37.375924147295455, 126.63285162967031],// stat
      [37.375267693564034, 126.63386483634098 ],
      [37.37589977074078, 126.63285128726395 ],
      [37.37729096662433,126.63256788988336],
      [37.3792774922298,126.6324960993986],
      [37.385990453708146,126.63993847972792],
      [37.38308798021501, 126.64251548843]//end
    ];


  return (
    <div className='main'>
      <MapContainer center={[37.5665, 126.9780]} zoom={15} scrollWheelZoom={true} style={{ width: "100%", height: "100vh" }} ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[37.56659, 126.9780]} icon={customIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>  
        </Marker>
        <Polyline positions={routeCoordinates} color="#258fff"/>
      </MapContainer>
      <div className='menu-bar'>
      <Link className='logo'>로고</Link>
      <Link className='menu-button'  to="/">검색</Link>
      <Link className='menu-button' style={{background:"#258fff", color:"#fff"}} to="/direction">길찾기</Link>
      <Link className='menu-button' to="/cctv">CCTV</Link>
      </div>
        <div className="menu">
        <div className='nav'>
        <div className='direction-tab'>도보경로</div>
        <div className='direction-tab'>안심경로</div>
        <input className='start'
          type="text"
          placeholder="출발지"
        />
        <input className='end'
          type="text"
          placeholder="도착지"
        />
        <button className='route-button' >경로 검색</button>
        </div>
        
      </div>
      </div>
    )

}
export default Direction;