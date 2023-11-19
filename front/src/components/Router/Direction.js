import "../styles/style.scss";
import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import axios from "axios";
import { decode } from "@mapbox/polyline";
import pedestrianImage from "../img/pedestrian.png";
import routeWalk from "../img/routewalk.png";
import Map from "./Map";
import Alert from "./Alert";
import MenuBar from "./MenuBar";
import DirectionUpdate from "../../module/\bDirectionUpdate";
import { handleResponseData } from "../../module/HandleResponseData";
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

  const mapRef = useRef();

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
      <Map
        markerPosition={markerPosition}
        setMarkerPosition={setMarkerPosition}
        mapRef={mapRef}
        decode={decode}
        cctvCircles={cctvCircles}
        osrmPolylines={osrmPolylines}
      />
      <Alert ref={alertRef} />
      <div className="menu">
        <MenuBar />
        <DirectionUpdate
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
          distance={distance}
          setDistance={setDistance}
          duration={duration}
          setDuration={setDuration}
          mapRef={mapRef}
          startLocationQuery={startLocationQuery}
          setStartLocationQuery={setStartLocationQuery}
          endLocationQuery={endLocationQuery}
          setEndLocationQuery={setEndLocationQuery}
          alertRef={alertRef}
          removeMarkers={removeMarkers}
          fetchLocationCoordinates={fetchLocationCoordinates}
          setOsrmPolylines={setOsrmPolylines}
          setCCTVCircles={setCCTVCircles}
        />
      </div>
    </div>
  );
}

export default Direction;
