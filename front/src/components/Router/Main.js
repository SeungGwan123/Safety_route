import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
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
import weatherDescKo from "../Router/KoreanDescription";
import logo from "../img/logo.jpeg";
import Direction from "./Direction";

function Main() {
  const Nominatim_Base_Url = "https://nominatim.openstreetmap.org/search";
  const OpenWeather_Base_Url =
    "https://api.openweathermap.org/data/2.5/weather";
  const OpenWeather_API_Key = "52d23d591c1d87740c8f298e811a8d8f";

  const [address, setAddress] = useState("");
  const [markerPosition, setMarkerPosition] = useState([37.5665, 126.97]);
  const [weatherData, setWeatherData] = useState(null);
  const mapRef = useRef();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
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
    try {
      const weatherResponse = await axios.get(OpenWeather_Base_Url, {
        params: {
          lat,
          lon,
          appid: OpenWeather_API_Key,
          units: "metric", // Use metric units for temperature
        },
      });

      console.log("Weather Data:", weatherResponse.data); // Add this line to check the response

      setWeatherData(weatherResponse.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const searchAddress = async () => {
    try {
      const response = await axios.get(Nominatim_Base_Url, {
        params: {
          q: address,
          format: "json",
          addressdetails: "1",
        },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        if (mapRef.current) {
          mapRef.current.setView([lat, lon], 15);
          setMarkerPosition([lat, lon]);
        }
      } else {
        console.error("Address not found.");
      }
    } catch (error) {
      console.error("Error searching for address:", error);
    }
  };

  const renderWeather = () => {
    if (weatherData) {
      const { main, weather } = weatherData;
      const weatherCode = weather[0].id;
      console.log(weatherCode);
      const koreanDescription = weatherDescKo[weatherCode];
      const weatherIconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
      return (
        <div className="weather">
          <p>{weatherData.name}</p>
          <p>{main.temp} °C</p>
          <p>
            {koreanDescription ? koreanDescription : weather[0].description}
          </p>
          <img src={weatherIconUrl} alt={koreanDescription} />
          <p>{main.humidity}%</p>
        </div>
      );
    }
    return null;
  };

  const customIcon = new L.Icon({
    iconUrl: require("../img/search.png"), // 이미지 경로를 올바르게 지정하세요.
    iconSize: [20, 24],
    iconAnchor: [12, 24],
  });

  return (
    <div className="main">
      {/* <div className='weather'>
          <p>날씨</p>
          <p>현재위치: </p>
          <p>온도: </p>
          <p>날씨:</p>
          <p>습기:</p>
        </div> */}
      {renderWeather()}
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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={markerPosition} icon={customIcon}>
          <Popup>
            여기는 서울입니다 <br /> 위도: 37.5665 경도: 126.9780 <br />
            도로명: 서울 중구 세종대로 110 서울특별시청
            <br />
            지번: 태평로1가 31
            <br />
            우편번호: 04524
          </Popup>
        </Marker>
      </MapContainer>
      <div className="nav">
        <input
          className="input-address"
          type="text"
          placeholder="주소를 입력하세요!"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchAddress();
            }
          }}
        />
        <div className="Search" onClick={searchAddress}></div>
      </div>
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
            style={{ borderColor: "#a0adb2" }}
          >
            <img src={cctvImage} alt="Route" width="20" height="20" />
            <div className="menu-button-content">
              <span>CCTV</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Main;
