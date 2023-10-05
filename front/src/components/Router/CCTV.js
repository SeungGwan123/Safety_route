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
  // const addressCoordinates = {
  //   '아카데미로 119': { lat: 37.375924147295455, lng: 126.63285162967031 }, // Replace with your own dataset
  //   '송도 타임스페이스': { lat: 37.38308798021501, lng: 126.64251548843 },
  //   '서울':{ lat: 37.5665, lng: 126.9780 }
  //   // Add more addresses and coordinates as needed
  // };
//   const cctvCoordinates=[
//     [37.570864,127.003371],
//     [37.570881,127.004878],
//     [37.571567,127.010944],
//     [37.571653,127.01308],

//     [37.581843,127.002123],//16
//     [37.570764,126.975918],
//     [37.585041,126.982137],
//     [37.576877,127.002369],

//     [37.5835,127.002609],//25
//     [37.582667,127.003884],
//     [37.572498,126.991473],
//     [37.57142,126.980701],

//     [37.583035,126.998637],//31
//     [37.569998,126.975498],
//     [37.572226,127.013539],
//     [37.574936,126.967743]

// ]

  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState([37.5665, 126.9780]);
  const mapRef = useRef();
  const [cctvData, setCCTVData] = useState([]);
  const [filteredCCTVData, setFilteredCCTVData] = useState([]);


 
  useEffect(() => {
  //axios로 백엔드 cctv 가져왔습니다
    axios.get('http://localhost:3001/cctv') // 백엔드 cctv 경로
      .then((response) => {
        const cctvData = response.data;
        setCCTVData(cctvData);
      })
      .catch((error) => {
        console.error("Error fetching CCTV data:", error);
      });
    
     //현재 재위치 일단 서울시청으로 박아둠
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([37.5665, 126.9780]);
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  }, []);
  const radius = 1000; //반지름 반경을 1000으로
  useEffect(() => {
     //cctv 위치
    if (userLocation) {
      const filteredMarkers = cctvData.filter((cctv) => {
        const cctvCoords = [parseFloat(cctv["WGS84위도"]), parseFloat(cctv["WGS84경도"])];
        const distance = L.latLng(userLocation).distanceTo(cctvCoords);
        return distance <= radius;
      });
      setFilteredCCTVData(filteredMarkers);
    }
  }, [userLocation, cctvData, radius]);
  

  // const searchAddress = () => {
  //   const coordinates = addressCoordinates[address];

  //   if (coordinates) {
  //     const { lat, lng } = coordinates;
  //     if (mapRef.current) {
  //       // Set the view of the TileLayer (OSM) to the new coordinates
  //       mapRef.current.setView([lat, lng], 15);
  //       setMarkerPosition([lat, lng]);
  //     }
  //   } else {
  //     console.error("Address not found in the dataset.");
  //   }
  // }

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
        {filteredCCTVData.map((cctv, index) => (
  <Marker key={index} position={[parseFloat(cctv["WGS84위도"]), parseFloat(cctv["WGS84경도"])]} icon={cctvIcon}>
    <Popup>
      관리기관명: {cctv["관리기관명"]}<br/>
      소재지도로명주소: {cctv["소재지도로명주소"]}<br/>
      설치목적구분: {cctv["설치목적구분"]}<br/>
      카메라대수: {cctv["카메라대수"]}<br/>
      설치연월: {cctv["설치연월"]}<br/>
      관리기관전화번호: {cctv["관리기관전화번호"]}<br/>
      데이터기준일자: {cctv["데이터기준일자"]}<br/>
    </Popup>
  </Marker>
))}

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
          {/* <div className='Search' onClick={searchAddress}></div> */}
        </div>
      </div>
    </div>
  )
}

export default CCTV;
