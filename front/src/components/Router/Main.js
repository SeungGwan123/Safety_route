import React, { useState, useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "../styles/style.scss";
import axios from "axios";
import Map from "./Map";
import Weather from "./Weather";
import MenuBar from "./MenuBar";
import Nav from "../../module/Nav";
import { handleAddressChange } from "../../module/handleAddressChange";

function Main() {
  const Nominatim_Base_Url = "https://nominatim.openstreetmap.org/search";
  const OpenWeather_Base_Url =
    "https://api.openweathermap.org/data/2.5/weather";
  const OpenWeather_API_Key = "d5adc8ce05e9e4cd506e8886305da11e";

  const [address, setAddress] = useState("");
  const [markerPosition, setMarkerPosition] = useState([37.5665, 126.97]);
  const [weatherData, setWeatherData] = useState(null);
  const mapRef = useRef();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      //현재 위치 좌표
      (position) => {
        const { latitude, longitude } = position.coords;
        setMarkerPosition([latitude, longitude]);
        fetchWeatherData(latitude, longitude);
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
        }
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    // 현재 날씨 요청
    try {
      const weatherResponse = await axios.get(OpenWeather_Base_Url, {
        params: {
          lat,
          lon,
          appid: OpenWeather_API_Key,
          units: "metric",
        },
      });

      console.log("Weather Data:", weatherResponse.data);

      setWeatherData(weatherResponse.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  return (
    <div className="main">
      <Weather weatherData={weatherData} />
      <Map markerPosition={markerPosition} mapRef={mapRef} />
      <Nav
        handleAddressChange={(newAddress) =>
          handleAddressChange(
            newAddress,
            setMarkerPosition,
            mapRef,
            Nominatim_Base_Url
          )
        }
        setAddress={setAddress}
        address={address}
      />
      <div className="menu">
        <MenuBar />
      </div>
    </div>
  );
}

export default Main;
