import "../styles/style.scss";
import React, { useEffect,useState, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from "leaflet";
import axios from 'axios'
import { decode } from '@mapbox/polyline';

function Direction(){
  const customIcon = new L.Icon({
    iconUrl: require("../img/search.png"), // 이미지 경로를 올바르게 지정하세요.
    iconSize: [20, 24],
    iconAnchor: [12, 24],
  });
  const mapRef=useRef();
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  useEffect(() => {
    async function fetchRouteData() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/route/v1/driving/126.63486162967031,37.376924147295455;126.64251548843,37.38308798021501?steps=true');
        if (response.data && response.data.routes && response.data.routes.length > 0) {
          const geometry = response.data.routes[0].geometry;
          const coordinates = decodePolyline(geometry);
          setRouteCoordinates(coordinates);
        } else {
          console.error('No valid route data found.');
        }
      } catch (error) {
        console.error('Error fetching route data:', error);
      }
    }

    fetchRouteData();
  }, []);

  // Helper function to decode polyline
  function decodePolyline(encoded) {
    const decoded = decode(encoded, { precision: 5 });
    return decoded.map(coord => ({ lat: coord[0], lng: coord[1] }));
  }


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
        <Polyline positions={routeCoordinates} color="#258fff" />
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