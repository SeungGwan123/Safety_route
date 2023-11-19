import React, { useState, useRef, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/style.scss";
import axios from "axios";
import MenuBar from "./MenuBar";
import Nav from "../../module/Nav";
import { handleAddressChange } from "../../module/handleAddressChange";
import Map from "./Map";

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

  const handleAddressChangeWrapper = (newAddress) => {
    handleAddressChange(
      newAddress,
      setMarkerPosition,
      mapRef,
      Nominatim_Base_Url,
      fetchCCTVData
    );
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
      <Map
        markerPosition={markerPosition}
        customIcon={customIcon}
        cctvMarkers={cctvMarkers}
        setCCTVMarkers={setCCTVMarkers}
        cctvData={cctvData}
        mapRef={mapRef}
        handleLocationChange={handleLocationChange}
        fetchCCTVData={fetchCCTVData}
      />

      <div className="menu">
        <MenuBar />
        <Nav
          handleAddressChange={handleAddressChangeWrapper}
          address={address}
          setAddress={setAddress}
        />
      </div>
    </div>
  );
}

export default CCTV;
