import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Circle } from 'react-leaflet';
import L from "leaflet";
import { Link } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import "../styles/style.scss";
import axios from "axios";
import routeImage from "../img/route.svg";
import homeImage from "../img/home.svg";
import cctvImage from "../img/cctv.svg";

function CCTV() {

  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState([37.5665, 126.9780]);
  const mapRef = useRef();
  const [cctvData, setCCTVData] = useState([]);
  const [filteredCCTVData, setFilteredCCTVData] = useState([]);

  
  const Nominatim_Base_Url = "https://nominatim.openstreetmap.org/search";
  const fetchCCTVData = async (latitude, longitude) => {
    try {
      // Create the data object in the expected format
      const requestData = {
        code: '1',
        data: [
          { x: longitude, y: latitude }
        ]
      };
      console.log(requestData)
  
      const response = await axios.post('http://localhost:8080/Safety_route/CCTV/searching', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Log the response data for debugging
      console.log('Response Data:', response.data);
  
      const cctvData = response.data.data;
      setCCTVData(cctvData);
    } catch (error) {
      console.error("Error fetching CCTV data:", error);
    }
  };
  
  

  const handleLocationChange = (newLatitude, newLongitude) => {
    setMarkerPosition([newLatitude, newLongitude]);
    fetchCCTVData(newLatitude, newLongitude);
  };

  const handleAddressChange = (newAddress) => {
    axios
      .get(Nominatim_Base_Url, {
        params: {
          q: newAddress,
          format: "json",
        },
      })
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          const newLatitude = parseFloat(lat);
          const newLongitude = parseFloat(lon);
          setMarkerPosition([newLatitude, newLongitude]);
          fetchCCTVData(newLatitude, newLongitude);
        } else {
          console.error("Address not found.");
        }
      })
      .catch((error) => {
        console.error("Error geocoding address:", error);
      });
  };

  useEffect(() => {
    if (userLocation) {
      handleLocationChange(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);
 

  const customIcon = new L.Icon({
    iconUrl: require("../img/search.png"), // 이미지 경로를 올바르게 지정하세요.
    iconSize: [20, 24],
    iconAnchor: [12, 24],
  });
  useEffect(() => {
    // Whenever cctvData changes, you can update the map with CCTV markers
    const cctvIcon = new L.Icon({
      iconUrl: require("../img/cctv.png"),
      iconSize: [15, 20],
      iconAnchor: [16, 21],
    });

    if (mapRef.current) {
      cctvData.forEach((cctv, index) => {
        const { x, y } = cctv;
        L.marker([y, x], { icon: cctvIcon }).addTo(mapRef.current);
      });
    }
  }, [cctvData]);

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

      </MapContainer>
      <div className='menu-bar'>
      <Link className='logo'>로고</Link>
      <Link className='menu-button'  to="/"><div className="menu-button-content">
        <img src={homeImage} alt="Route" />
        <span>검색</span>
      </div></Link>
      <Link className='menu-button' to="/direction"><div className="menu-button-content">
        <img src={routeImage} alt="Route" />
        <span>길찾기</span>
      </div></Link>
      <Link className='menu-button' style={{background:"#258fff", color:"#fff"}} to="/cctv"><div className="menu-button-content">
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
        />
        <button onClick={() => handleAddressChange(address)}>검색</button>
        </div>
      </div>
    </div>
  )
}

export default CCTV;
