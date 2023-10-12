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
const Nominatim_Base_Url = 'https://nominatim.openstreetmap.org/search';

function Direction() {
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState([37.5665, 126.9780]);
  const [cctvData, setCCTVData] = useState([]);
  const [filteredCCTVData, setFilteredCCTVData] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [cctvCircles, setCCTVCircles] = useState([]);
  const [osrmPolyline, setOsrmPolyline] = useState('');
  const [startLocationQuery, setStartLocationQuery] = useState('');
  const [endLocationQuery, setEndLocationQuery] = useState('');
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [osrmPolylines, setOsrmPolylines] = useState([]);

  useEffect(() => {

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

  async function fetchRouteData() {
    try {
        const requestData = {
           
        };

        const response = await axios.post(
            'http://localhost:8080/Safety_route/walking',
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json', // Set the content type
                },
            }
        );

        if (response.data && response.data.code === 1) {
            const data = JSON.parse(response.data.data);
            if (data.routes && data.routes.length > 0) {
                const osrmPolyline = data.routes[0].geometry;
                return osrmPolyline;
            } else {
                console.error('No valid route data found.');
                return null;
            }
        } else {
            console.error('No valid route data found.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching route data:', error);
        return null;
    }
}
const fetchLocationCoordinates = async (query) => {
  try {
    const response = await axios.get(Nominatim_Base_Url, {
      params: {
        q: query,
        format: 'json',
      },
    });

    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      return { lat: parseFloat(location.lat), lon: parseFloat(location.lon) };
    } else {
      console.error('No location data found for the query.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
};
  
  useEffect(() => {
    async function fetchData() {
      const osrmPolyline = await fetchRouteData();
      console.log('osrmPolyline:', osrmPolyline); // 로깅
      if (osrmPolyline && osrmPolyline.length > 0) {
        const decodedCoordinates = decode(osrmPolyline, { precision: 5 });
        setRouteCoordinates(decodedCoordinates); // Set the decoded coordinates
      } else {
        console.error('Invalid osrmPolyline data');
      }
    }

    fetchData();
  }, []);
  const decodedCoordinates = decode(osrmPolyline, { precision: 5 });
  
  
  



 

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
        {osrmPolylines.map((osrmPolyline, index) => (
  <Polyline key={index} positions={decode(osrmPolyline, { precision: 5 })} color='#258fff' />
))}
    

    {cctvCircles}  {/* Render the circles */}
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
          <input
            className='start'
            type='text'
            placeholder='출발지'
            value={startLocationQuery}
            onChange={(e) => setStartLocationQuery(e.target.value)}
          />
          <input
            className='end'
            type='text'
            placeholder='도착지'
            value={endLocationQuery}
            onChange={(e) => setEndLocationQuery(e.target.value)}
          />
         <button
className="route-button"
onClick={async () => {
  try {
    const startLocationCoords = await fetchLocationCoordinates(startLocationQuery);
    const endLocationCoords = await fetchLocationCoordinates(endLocationQuery);

    if (startLocationCoords && endLocationCoords) {
      const response = await axios.get(
        'http://127.0.0.1:5001/find_safe_route',
        {
          params: {
            depart_x: startLocationCoords.lon,
            depart_y: startLocationCoords.lat,
            arrive_x: endLocationCoords.lon,
            arrive_y: endLocationCoords.lat,
          },
        }
      );

      if (response.data && response.data.OSRM_response && response.data.OSRM_response.routes) {
        const routes = response.data.OSRM_response.routes;
        console.log(response.data)
        
        if (routes.length > 0) {
          const polylines = routes.map(route => route.geometry);
          setOsrmPolylines(polylines);
          if (response.data.near_cctv && Array.isArray(response.data.near_cctv)) {
            console.log('Received CCTV Data:', response.data.near_cctv);
            // Now, you can set the CCTV data to state
            setCCTVData(response.data.near_cctv);
            const cctvCircles = response.data.near_cctv
            .map((cctv, index) => {
              if (cctv.length >= 13) {
                const latitude = cctv[index][11]; // Access the 12th element of the inner array for latitude
                const longitude = cctv[index][12]; // Access the 13th element of the inner array for longitude
      
                const cctvLocation = [parseFloat(latitude), parseFloat(longitude)]; // Convert to floating-point numbers
      
                return (
                  <Circle center={cctvLocation} radius={50} color="red" key={index}>
                    <Popup>
                      Latitude: {latitude} <br />
                      Longitude: {longitude}
                    </Popup>
                  </Circle>
                );
              } else {
                return null;
              }
            });
      
          // Now, set the cctvCircles to state
          setCCTVCircles(cctvCircles);
          }
        } else {
          console.error('No routes found.');
        }
      } else {
        console.error('No valid route data found.');
      }
    }
  } catch (error) {
    console.error('Error fetching route data:', error);
  }
  
}}
>
경로 검색
</button>


        </div>
      </div>
    </div>
  );
}

export default Direction;