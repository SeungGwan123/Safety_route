import "../styles/style.scss";
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Polyline, Circle } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from "leaflet";
import axios from 'axios'
import { decode } from '@mapbox/polyline';
import routeImage from "../img/route.svg";
import homeImage from "../img/home.svg";
import cctvImage from "../img/cctv.svg";

function Direction() {
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState([37.5665, 126.9780]);
  const [cctvData, setCCTVData] = useState([]);
  const [filteredCCTVData, setFilteredCCTVData] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [cctvCircles, setCCTVCircles] = useState([]);

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

  const radius = 1200; //반지름 반경을 1000으로

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

  const customIcon = new L.Icon({
    iconUrl: require("../img/search.png"),
    iconSize: [20, 24],
    iconAnchor: [12, 24],
  });

  const cctvIcon = new L.Icon({
    iconUrl: require("../img/cctv.png"),
    iconSize: [15, 20],
    iconAnchor: [16, 21],
  });

  const mapRef = useRef();

  useEffect(() => {
    async function fetchRouteData() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/route/v1/foot/126.9780,37.5665;126.9829812177374,37.569374723904296?alternatives=3&steps=true');
        if (response.data && response.data.routes && response.data.routes.length > 0) {
          const routeData = response.data.routes.slice(0, 3); // Get the first 3 alternative routes
          const coordinates = routeData.map(route => decodePolyline(route.geometry));
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

  //decode
  function decodePolyline(encoded) {
    const decoded = decode(encoded, { precision: 5 });
    return decoded.map(coord => ({ lat: coord[0], lng: coord[1] }));
  }

  const calculateBoundingBox = (routeCoordinates) => {
    const bounds = L.latLngBounds();
    routeCoordinates.forEach((coord) => {
      bounds.extend(coord);
    });
    return bounds;
  };

  // Function to filter CCTV markers within the bounding box
  const filterCCTVsInBoundingBox = (cctvData, boundingBox) => {
    return cctvData.filter((cctv) => {
      const cctvCoords = [parseFloat(cctv['WGS84위도']), parseFloat(cctv['WGS84경도'])];
      return boundingBox.contains(L.latLng(cctvCoords));
    });
  };
  
  // Calculate the bounding box for the route
  const routeBoundingBox = calculateBoundingBox(routeCoordinates);

  // Filter CCTV markers within the bounding box
  const nearbyCCTVs = filterCCTVsInBoundingBox(cctvData, routeBoundingBox);

  // Calculate circles for nearby CCTV markers
  useEffect(() => {
    const circles = nearbyCCTVs.map((cctv, index) => {
      const cctvCoords = [parseFloat(cctv['WGS84위도']), parseFloat(cctv['WGS84경도'])];
      return (
        <Circle
          key={index}
          center={cctvCoords}
          radius={20} // Set the desired radius of the circle
          fillColor="red" // Set the fill color of the circle
          fillOpacity={0.5} // Set the fill opacity of the circle
        />
      );
    });

    setCCTVCircles(circles);
  }, [nearbyCCTVs]);

  return (
    <div className='main'>
      <MapContainer center={[37.5665, 126.9780]} zoom={15} scrollWheelZoom={true} style={{ width: '100%', height: '100vh' }} ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[37.56659, 126.9780]} icon={customIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        
        {routeCoordinates.map((coordinates, routeIndex) => (
          <Polyline key={routeIndex} positions={coordinates} color='#258fff' />
        ))}

        {nearbyCCTVs.map((cctv, index) => (
          <Marker key={index} position={[parseFloat(cctv['WGS84위도']), parseFloat(cctv['WGS84경도'])]} icon={cctvIcon}>
            <Popup>
              관리기관명: {cctv['관리기관명']}<br />
              소재지도로명주소: {cctv['소재지도로명주소']}<br />
              설치목적구분: {cctv['설치목적구분']}<br />
              카메라대수: {cctv['카메라대수']}<br />
              설치연월: {cctv['설치연월']}<br />
              관리기관전화번호: {cctv['관리기관전화번호']}<br />
              데이터기준일자: {cctv['데이터기준일자']}<br />
            </Popup>
          </Marker>
        ))}

        {filteredCCTVData.map((cctv, index) => (
          <Marker key={index} position={[parseFloat(cctv['WGS84위도']), parseFloat(cctv['WGS84경도'])]} icon={cctvIcon}>
            <Popup>
              관리기관명: {cctv['관리기관명']}<br />
              소재지도로명주소: {cctv['소재지도로명주소']}<br />
              설치목적구분: {cctv['설치목적구분']}<br />
              카메라대수: {cctv['카메라대수']}<br />
              설치연월: {cctv['설치연월']}<br />
              관리기관전화번호: {cctv['관리기관전화번호']}<br />
              데이터기준일자: {cctv['데이터기준일자']}<br />
            </Popup>
          </Marker>
        ))}

        {cctvCircles} {/* Render the circles */}
      </MapContainer>
      <div className='menu-bar'>
        <Link className='logo'>로고</Link>
        <Link className='menu-button' to='/'><div className="menu-button-content">
        <img src={homeImage} alt="Route" />
        <span>검색</span>
      </div></Link>
        <Link className='menu-button' style={{ background: '#258fff', color: '#fff' }} to='/direction'><div className="menu-button-content">
        <img src={routeImage} alt="Route" />
        <span>길찾기</span>
      </div></Link>
        <Link className='menu-button' to='/cctv'><div className="menu-button-content">
        <img src={cctvImage} alt="Route" />
        <span>CCTV</span>
      </div></Link>
      </div>
      <div className='menu'>
        <div className='nav'>
          <div className='direction-tab'>도보경로</div>
          <div className='direction-tab'>안심경로</div>
          <input className='start'
            type='text'
            placeholder='출발지'
          />
          <input className='end'
            type='text'
            placeholder='도착지'
          />
          <button className='route-button' >경로 검색</button>
        </div>
      </div>
    </div>
  );
}

export default Direction;
