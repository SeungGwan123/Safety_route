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
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMarkerPosition([latitude, longitude]);
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
        }
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  }, []);
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
  
          if (mapRef.current) {
            mapRef.current.setView([newLatitude, newLongitude], 15);
          }
        } else {
          console.error("Address not found.");
        }
      })
      .catch((error) => {
        console.error("Error geocoding address:", error);
      });
  };
  const fetchCCTVData = async (latitude, longitude) => {
    try {
        const requestData = {
            x: longitude,
            y: latitude,
        };

        const url = `http://localhost:8080/Safety_route/CCTV/searching`;

        const response = await axios.post(url, requestData);

        console.log('Response Data:', response.data);
        const cctvData = response.data;
        setCCTVData(cctvData);
    } catch (error) {
        console.error("Error fetching CCTV data:", error);
    }
};

  
  
  

  const handleLocationChange = (newLatitude, newLongitude) => {
    setMarkerPosition([newLatitude, newLongitude]);
    fetchCCTVData(newLatitude, newLongitude);
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
      iconSize: [25, 35],
      iconAnchor: [16, 21],
    });

    if (mapRef.current) {
      if (Array.isArray(cctvData.data)) {
        cctvData.data.forEach((cctv, index) => {
          if (typeof cctv.equator === 'number' && typeof cctv.latitude === 'number') {
            // Check if equator and latitude are valid numbers
            L.marker([cctv.latitude, cctv.equator], { icon: cctvIcon }).addTo(mapRef.current);
          } else {
            console.error("Invalid coordinates (equator, latitude):", cctv.equator, cctv.latitude);
          }
        });
      } else {
        console.error("cctvData.data is not an array:", cctvData.data);
      }
    }
    })
    

  return (
    <div className='main'>
      <MapContainer center={markerPosition} zoom={15} scrollWheelZoom={true} style={{ width: "100%", height: "100vh" }} ref={mapRef}>
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