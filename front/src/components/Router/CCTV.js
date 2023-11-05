import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Circle,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../styles/style.scss";
import axios from "axios";
import routeImage from "../img/route.svg";
import homeImage from "../img/home.svg";
import cctvImage from "../img/cctv.svg";
import logo from "../img/logo.jpeg";
import cctvBind from "../img/cctvpopup.png";

function CCTV() {
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState([37.5665, 126.978]);
  const mapRef = useRef();
  const [cctvData, setCCTVData] = useState([]);
  const [cctvMarkers, setCCTVMarkers] = useState([]);

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

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on("moveend", () => {
        console.log("Map dragged!");
        const newCenter = mapRef.current.getCenter();
        console.log("New Center (lat, lng):", newCenter.lat, newCenter.lng);
        fetchCCTVData(newCenter.lat, newCenter.lng);
      });
    }
  }, [mapRef]);

  useEffect(() => {
    if (userLocation) {
      handleLocationChange(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

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
          alert("주소가 없습니다 다시 검색해주세요");
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
      console.log("Response Data:", response.data);

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

  const customIcon = new L.Icon({
    iconUrl: require("../img/search.png"), // 이미지 경로를 올바르게 지정하세요.
    iconSize: [30, 40],
    iconAnchor: [12, 24],
  });

  useEffect(() => {
    console.log("cctvData changed:", cctvData);
    if (mapRef.current) {
      // Clear existing markers
      cctvMarkers.forEach((marker) => {
        mapRef.current.removeLayer(marker);
      });

      // Add new CCTV markers
      if (Array.isArray(cctvData.data)) {
        const newMarkers = [];
        const cctvIcon = new L.Icon({
          iconUrl: require("../img/cctv.png"),
          iconSize: [20, 24],
          iconAnchor: [5, 10],
        });

        cctvData.data.forEach((cctv, index) => {
          if (
            typeof cctv.equator === "number" &&
            typeof cctv.latitude === "number"
          ) {
            const marker = L.marker([cctv.latitude, cctv.equator], {
              icon: cctvIcon,
            }).addTo(mapRef.current);

            const popupContent = `
            <b>번호:</b> ${cctv.id}<br>
            <img src="http://192.168.174.122:8000/stream.mjpg" />
            <b>위치:</b> ${cctv.Area}<br>
            <b>전화번호:</b> ${cctv.call}<br>
            <b>설치일자:</b> ${cctv.install_date}<br>
            <b>상세위치:</b> ${cctv.new_address}<br>
            <b>설치이유:</b> ${cctv.purpose}<br>
            <b>최근 업데이트:</b> ${cctv.recent_update}<br>
          `;

            marker.bindPopup(popupContent, {
              minWidth: 350, // Set a minimum width for the popup
              className: "custom-popup",
            });
            newMarkers.push(marker);
          } else {
            console.error(
              "Invalid coordinates (equator, latitude):",
              cctv.equator,
              cctv.latitude
            );
          }
        });

        setCCTVMarkers(newMarkers);
      } else {
        console.error("cctvData.data is not an array:", cctvData.data);
      }
    }
  }, [cctvData]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on("moveend", () => {
        const newCenter = mapRef.current.getCenter();
        handleLocationChange(newCenter.lat, newCenter.lng);
      });
    }
  }, [mapRef.current]);

  return (
    <div className="main">
      <MapContainer
        center={markerPosition}
        zoom={15}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100vh" }}
        ref={mapRef}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
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
      </MapContainer>

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
            style={{ borderColor: "#03c75a" }}
          >
            <img src={routeImage} alt="Route" width="20" height="20" />
            <div className="menu-button-content">
              <span>길찾기</span>
            </div>
          </Link>
          <Link
            className="menu-button"
            to="/cctv"
            style={{ borderColor: "#a0adb2", background: "#e8e8ea" }}
          >
            <img src={cctvImage} alt="Route" width="20" height="20" />
            <div className="menu-button-content">
              <span>CCTV</span>
            </div>
          </Link>
        </div>
        <div className="nav">
          <input
            className="input-address"
            type="text"
            placeholder="주소를 입력해 주변 cctv를 확인하세요!"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddressChange(address);
              }
            }}
          />
          <div className="Search" onClick={() => handleAddressChange(address)}>
            검색
          </div>
        </div>
      </div>
    </div>
  );
}

export default CCTV;
