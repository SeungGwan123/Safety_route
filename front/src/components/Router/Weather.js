import React from "react";
import weatherDescKo from "../Router/KoreanDescription";
function Weather({ weatherData }) {
  if (weatherData) {
    const { main, weather } = weatherData;
    const weatherCode = weather[0].id;
    const koreanDescription = weatherDescKo[weatherCode];
    const weatherIconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    return (
      <div className="weather">
        <p>{weatherData.name}</p>
        <p>{main.temp} °C</p>
        <p>{koreanDescription ? koreanDescription : weather[0].description}</p>
        <img src={weatherIconUrl} alt={koreanDescription} />
        <p>{main.humidity}%</p>
      </div>
    );
  }

  return null;
}

export default Weather;
