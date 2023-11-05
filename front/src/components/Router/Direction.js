import "../styles/style.scss";
import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  Circle,
  ZoomControl,
} from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import axios from "axios";
import { decode } from "@mapbox/polyline";
import routeImage from "../img/route.svg";
import homeImage from "../img/home.svg";
import cctvImage from "../img/cctv.svg";
import pedestrianImage from "../img/pedestrian.png";
import routeWalk from "../img/routewalk.png";
import routeButton from "../img/routebutton.png";
import logo from "../img/logo.jpeg";
import cctvBind from "../img/cctvpopup.png";
const Nominatim_Base_Url = "https://nominatim.openstreetmap.org/search";

function Direction() {
  const [address, setAddress] = useState("");
  const [markerPosition, setMarkerPosition] = useState([37.5665, 126.978]);
  const [cctvData, setCCTVData] = useState([]);
  const [filteredCCTVData, setFilteredCCTVData] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [cctvCircles, setCCTVCircles] = useState([]);
  const [osrmPolyline, setOsrmPolyline] = useState("");
  const [startLocationQuery, setStartLocationQuery] = useState("");
  const [endLocationQuery, setEndLocationQuery] = useState("");
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [osrmPolylines, setOsrmPolylines] = useState([]);
  const [selectedTab, setSelectedTab] = useState("도보경로");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const alertRef = useRef(null);

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

  const customIcon = new L.Icon({
    iconUrl: require("../img/search.png"), // 이미지 경로를 올바르게 지정하세요.
    iconSize: [30, 40],
    iconAnchor: [12, 24],
  });
  const destinationIcon = new L.Icon({
    iconUrl: require("../img/flag.png"),
    iconSize: [30, 35],
    iconAnchor: [12, 24],
  });
  const startIcon = new L.Icon({
    iconUrl: require("../img/start.png"),
    iconSize: [30, 35],
    iconAnchor: [12, 24],
  });
  const cctvIcon = new L.Icon({
    iconUrl: require("../img/cctv.png"),
    iconSize: [20, 24],
    iconAnchor: [5, 10],
  });

  const mapRef = useRef();

  async function fetchRouteData() {
    try {
      const requestData = {};

      const response = await axios.post(
        "http://localhost:8080/Safety_route/walking",
        requestData,
        {
          headers: {
            "Content-Type": "application/json", // Set the content type
          },
        }
      );

      if (response.data && response.data.code === 1) {
        console.log(response.data);
        const data = JSON.parse(response.data.data);
        if (data.routes && data.routes.length > 0) {
          const osrmPolyline = data.routes[0].geometry;
          return osrmPolyline;
        } else {
          console.error("No valid route data found.");
          return null;
        }
      } else {
        console.error("No valid route data found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
      return null;
    }
  }

  const fetchLocationCoordinates = async (query) => {
    try {
      const response = await axios.get(Nominatim_Base_Url, {
        params: {
          q: query,
          format: "json",
        },
      });

      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        return { lat: parseFloat(location.lat), lon: parseFloat(location.lon) };
      } else {
        alert("경로가 없습니다 다시 검색해주세요");
        return null;
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      return null;
    }
  };

  useEffect(() => {
    async function fetchData() {
      const osrmPolyline = await fetchRouteData();
      console.log("osrmPolyline:", osrmPolyline); // 로깅
      if (osrmPolyline && osrmPolyline.length > 0) {
        const decodedCoordinates = decode(osrmPolyline, { precision: 5 });
        setRouteCoordinates(decodedCoordinates); // Set the decoded coordinates
      } else {
        console.error("Invalid osrmPolyline data");
      }
    }

    fetchData();
  }, []);
  const decodedCoordinates = decode(osrmPolyline, { precision: 5 });
  const removeMarkers = () => {
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Circle) {
          mapRef.current.removeLayer(layer);
        }
      });
    }
  };

  return (
    <div className="main">
      <MapContainer
        center={markerPosition}
        zoom={15}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100vh" }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://xdworld.vworld.kr:8080/2d/Base/202002/{z}/{x}/{y}.png"
        />
        <Marker position={markerPosition} icon={customIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {osrmPolylines.map((osrmPolyline, index) => (
          <Polyline
            key={index}
            positions={decode(osrmPolyline, { precision: 5 })}
            color="rgb(4, 117, 244)"
            weight={6}
          />
        ))}
        {cctvCircles} {/* Render the circles */}
      </MapContainer>
      <div className="alert" ref={alertRef}></div>
      <div className="menu">
        <div className="menu-bar">
          <div className="logo">Safety Route</div>
          <Link className="menu-button" to="/">
            {" "}
            <img src={homeImage} alt="Route" width="20" height="20" />
            <div className="menu-button-content">
              <span>검색</span>
            </div>
          </Link>
          <Link
            className="menu-button"
            to="/direction  "
            style={{ borderColor: "#03c75a", background: "#e8e8ea" }}
          >
            <img src={routeImage} alt="Route" width="20" height="20" />
            <div className="menu-button-content">
              <span>길찾기</span>
            </div>
          </Link>
          <Link
            className="menu-button"
            to="/cctv"
            style={{ borderColor: "#a0adb2" }}
          >
            <img src={cctvImage} alt="Route" width="20" height="20" />
            <div className="menu-button-content">
              <span>CCTV</span>
            </div>
          </Link>
        </div>

        <div className="nav-direction">
          <div className="direction-tab1"></div>
          <div className="direction-tab2">
            <div
              className="walk"
              onClick={() => setSelectedTab("도보경로")}
              style={{
                color: selectedTab === "도보경로" ? "#258fff" : "initial",
              }}
            >
              도보경로{" "}
            </div>
            <div
              className="safe"
              onClick={() => setSelectedTab("안심경로")}
              style={{
                color: selectedTab === "안심경로" ? "#258fff" : "initial",
              }}
            >
              안심경로
            </div>
          </div>
          <img className="pd" src={pedestrianImage} alt="src"></img>
          <input
            className="start"
            type="text"
            placeholder="출발지"
            value={startLocationQuery}
            onChange={(e) => setStartLocationQuery(e.target.value)}
          />
          <input
            className="end"
            type="text"
            placeholder="도착지"
            value={endLocationQuery}
            onChange={(e) => setEndLocationQuery(e.target.value)}
          />
          <div className="info-cont">
            {distance !== null && duration !== null && (
              <div className="info-content">
                <div className="info-row">
                  <span className="info-label">목적지까지 거리:</span>
                  <span className="info-value">{distance} km</span>
                </div>
                <div className="info-row">
                  <span className="info-label">도보 소요 시간:</span>
                  <span className="info-value">{duration} 시간</span>
                </div>
              </div>
            )}
            <img className="routeWalk" src={routeWalk}></img>
          </div>

          <button
            className="route-button"
            onClick={async () => {
              const info = document.querySelector(".info-cont");
              alertRef.current.classList.remove("show");
              removeMarkers();

              try {
                const startLocationCoords = await fetchLocationCoordinates(
                  startLocationQuery
                );
                const endLocationCoords = await fetchLocationCoordinates(
                  endLocationQuery
                );

                if (startLocationCoords && endLocationCoords) {
                  const startLat = startLocationCoords.lat;
                  const startLon = startLocationCoords.lon;
                  const endLat = endLocationCoords.lat;
                  const endLon = endLocationCoords.lon;

                  const response = await axios.get(
                    "http://127.0.0.1:5001/find_safe_route",
                    {
                      params: {
                        depart_x: startLon,
                        depart_y: startLat,
                        arrive_x: endLon,
                        arrive_y: endLat,
                      },
                    }
                  );

                  if (
                    response.data &&
                    response.data.OSRM_response &&
                    response.data.OSRM_response.routes
                  ) {
                    const routes = response.data.OSRM_response.routes;
                    console.log(response.data);
                    if (selectedTab === "도보경로") {
                      // Handle when the "도보경로" tab is selected
                      setOsrmPolylines([routes[0].geometry]); // Display the route without CCTV
                      mapRef.current.setView([startLat, startLon], 15);
                      setCCTVCircles([]); // Remove CCTV markers
                      const distanceInKilometers = (
                        routes[0].distance / 1000
                      ).toFixed(2); // Format distance with two decimal places
                      const durationInSeconds = routes[0].duration;
                      const hours = Math.floor(durationInSeconds / 3600); // 초를 시간으로 변환
                      const minutes = Math.floor(
                        (durationInSeconds % 3600) / 60
                      );
                      info.style.visibility = "visible";
                      setDistance(distanceInKilometers);
                      setDuration(`${hours} 시간 ${minutes} 분`);
                      const startMarker = L.marker([startLat, startLon], {
                        icon: startIcon,
                      }).addTo(mapRef.current);
                      const endMarker = L.marker([endLat, endLon], {
                        icon: destinationIcon,
                      }).addTo(mapRef.current);

                      startMarker.bindPopup("출발지");
                      endMarker.bindPopup("도착지");
                    } else {
                      // Handle when the "안심경로" tab is selected
                      // ... Your existing code ...

                      if (routes.length > 0) {
                        // Find the index of the longest CCTV data array
                        let maxCctvIndex = 0;
                        let maxCctvLength = response.data.near_cctv[0].length;

                        for (
                          let i = 1;
                          i < response.data.near_cctv.length;
                          i++
                        ) {
                          if (
                            response.data.near_cctv[i].length > maxCctvLength
                          ) {
                            maxCctvLength = response.data.near_cctv[i].length;
                            maxCctvIndex = i;
                          }
                        }

                        // Use the index to select the corresponding OSRM route
                        const selectedRoute = routes[maxCctvIndex];

                        const polylines = selectedRoute.geometry;
                        const distance = selectedRoute.distance; // Distance in meters
                        const duration = selectedRoute.duration;
                        setOsrmPolylines([polylines]);
                        const selectedCctvSet =
                          response.data.near_cctv[maxCctvIndex];
                        if (
                          response.data.near_cctv &&
                          Array.isArray(response.data.near_cctv)
                        ) {
                          console.log(
                            "Received CCTV Data:",
                            response.data.near_cctv
                          );
                          // Now, you can set the CCTV data to state
                          const cctvCircles = response.data.near_cctv.map(
                            (set, setIndex) => {
                              return selectedCctvSet.map((cctv, index) => {
                                if (cctv.WGS84경도) {
                                  const latitude = parseFloat(cctv.WGS84위도);
                                  const longitude = parseFloat(cctv.WGS84경도);
                                  const cctvLocation = [latitude, longitude];
                                  const warning = "위험";
                                  const cctvInfo = {
                                    cctv_number: cctv.번호,
                                  };

                                  console.log(
                                    "Sending POST request for CCTV number:",
                                    cctvInfo.cctv_number
                                  );

                                  // Send a POST request for each CCTV number
                                  axios
                                    .post(
                                      "http://127.0.0.1:5001/send_cctv_number",
                                      cctvInfo,
                                      {
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                      }
                                    )
                                    .then((response) => {
                                      const data = response.data;
                                      console.log(
                                        "Response for CCTV number:",
                                        cctvInfo.cctv_number,
                                        data
                                      );
                                      handleResponseData(response.data, cctv);

                                      // Handle the response data in your React application
                                    })
                                    .catch((error) => {
                                      console.error(
                                        "Error for CCTV number:",
                                        cctvInfo.cctv_number,
                                        error
                                      );
                                    });
                                  function handleResponseData(data, cctv) {
                                    const markers = []; // Create an array to hold the Leaflet marker objects

                                    if (
                                      cctv.번호 === data.cctv_number &&
                                      warning === data.risk_level
                                    ) {
                                      alertRef.current.innerHTML = `cctv 번호: ${data.cctv_number}<br/>위험도: ${data.risk_level}<br/>현재상황: ${data.content}`;
                                      alertRef.current.classList.add("show");
                                      console.log("if");
                                      const redIcon = new L.Icon({
                                        iconUrl: require("../img/redcctv.png"), // URL for your custom red marker icon
                                        iconSize: [20, 24],
                                        iconAnchor: [10, 12], // Adjust the anchor point if necessary
                                      });

                                      // Create a marker with the red icon
                                      const redMarker = L.marker(cctvLocation, {
                                        icon: redIcon,
                                      }).addTo(mapRef.current);

                                      L.circle(cctvLocation, {
                                        color: "red",
                                        fill: false,
                                        weight: 2,
                                        radius: 50,
                                      }).addTo(mapRef.current);

                                      // Apply custom CSS styles for the popup content
                                      const popupContent = `
                                      <div class="custom-popup">
                                        <p class="popup-title">CCTV 번호: ${cctv.번호}</p>
                                        <img src=https://image.zdnet.co.kr/2023/07/21/enter72f35aebaa72d84db434a8b952117dff.jpg />
                                        <p>WGS84 경도: ${cctv.WGS84경도}</p>
                                        <p>WGS84 위도: ${cctv.WGS84위도}</p>
                                        <p>관리기관명: ${cctv.관리기관명}</p>
                                        <p>설치목적: ${cctv.설치목적}</p>
                                        <p>설치연월: ${cctv.설치연월}</p>
                                        <p>소재지 도로명주소: ${cctv.소재지도로명주소}</p>
                                        <p>촬영방면정보: ${cctv.촬영방면정보}</p>
                                        <p>카메라대수: ${cctv.카메라대수}</p>
                                        <p>카메라화소: ${cctv.카메라화소}</p>
                                        
                                      </div>
                                    `;

                                      // Add the custom popup to the marker
                                      redMarker.bindPopup(popupContent, {
                                        maxWidth: 350, // Set a maximum width for the popup
                                        className: "custom-popup", // Add a custom CSS class to style the popup
                                      });

                                      markers.push(redMarker); // Add the red marker to the array
                                    } else {
                                      console.log("else");
                                      // Create a marker with the default icon
                                      const regularMarker = L.marker(
                                        cctvLocation,
                                        { icon: cctvIcon }
                                      ).addTo(mapRef.current);

                                      // Create a custom popup content with HTML and CSS styles
                                      const popupContent = `
                                      <div class="custom-popup">
                                        <p class="popup-title">CCTV 번호: ${cctv.번호}</p>
                                        <img src="http://192.168.174.122:8000/stream.mjpg" />
                                        <p>WGS84 경도: ${cctv.WGS84경도}</p>
                                        <p>WGS84 위도: ${cctv.WGS84위도}</p>
                                        <p>관리기관명: ${cctv.관리기관명}</p>
                                        <p>설치목적: ${cctv.설치목적}</p>
                                        <p>설치연월: ${cctv.설치연월}</p>
                                        <p>소재지 도로명주소: ${cctv.소재지도로명주소}</p>
                                        <p>촬영방면정보: ${cctv.촬영방면정보}</p>
                                        <p>카메라대수: ${cctv.카메라대수}</p>
                                        <p>카메라화소: ${cctv.카메라화소}</p>
                                        
                                      </div>
                                    `;

                                      // Add the custom popup to the marker
                                      regularMarker.bindPopup(popupContent, {
                                        minWidth: 350, // Set a minimum width for the popup
                                        className: "custom-popup", // Add a custom CSS class to style the popup
                                      });

                                      markers.push(regularMarker); // Add the regular marker to the array
                                    }

                                    // Now, add the markers to the map
                                    markers.forEach((marker) => {
                                      mapRef.current.addLayer(marker);
                                    });

                                    return markers; // Return the marker objects if needed
                                  }
                                } else {
                                  return null;
                                }
                              });
                            }
                          );

                          mapRef.current.setView([startLat, startLon], 15);
                          setCCTVCircles(cctvCircles);

                          // Set the cctvCircles to state for rendering

                          info.style.visibility = "visible";
                          const km = (distance / 1000).toFixed(2); // 미터를 킬로미터로 변환하여 소수점 2자리까지 표시
                          const durationInSeconds = duration; // 이미 초 단위로 표시되어 있으므로 변환할 필요 없음
                          const hours = Math.floor(durationInSeconds / 3600); // 초를 시간으로 변환
                          const minutes = Math.floor(
                            (durationInSeconds % 3600) / 60
                          ); // 초를 분으로 변환
                          const hr = `${hours} 시간 ${minutes} 분`;

                          setDistance(km);
                          setDuration(hr);
                          const startMarker = L.marker([startLat, startLon], {
                            icon: startIcon,
                          }).addTo(mapRef.current);
                          const endMarker = L.marker([endLat, endLon], {
                            icon: destinationIcon,
                          }).addTo(mapRef.current);

                          startMarker.bindPopup("출발지");
                          endMarker.bindPopup("도착지");
                        }
                      } else {
                        console.error("No routes found.");
                      }
                    }
                  } else {
                    console.error("No valid route data found.");
                  }
                }
              } catch (error) {
                console.error("Error fetching route data:", error);
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
