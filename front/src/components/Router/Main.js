import React, { useEffect, useState } from 'react';
import axios from 'axios';

/* global Tmapv2 */ // Add this line to inform ESLint about the global variable

function Main() {
  const [startX, setStartX] = useState('');
  const [startY, setStartY] = useState('');
  const [endX, setEndX] = useState('');
  const [endY, setEndY] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Load Tmap API library
    const script = document.createElement("script");
    script.src = "https://openapi.sk.com/tmap/js/v2.0.0/tmap.min.js";
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      // The Tmap API library has loaded, you can now use Tmapv2 here.
      const map = new Tmapv2.Map("TMapApp", {
        center: new Tmapv2.LatLng(37.566481622437934, 126.98502302169841),
        zoom: 15
      });
      setMap(map);
    };

    document.head.appendChild(script);

    // Unload the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    }
  }, []);
  
  const handleCalculateRoute = () => {
    axios
      .get('/calculate-route', {
        params: {
          startX,
          startY,
          endX,
          endY,
        },
      })
      .then((response) => {
        const coordinates = response.data.features[0].geometry.coordinates;
        setRouteCoordinates(coordinates);

        // Draw the route manually on the map
        if (map) {
          const routePath = new Tmapv2.Polyline({
            map,
            path: coordinates.map((coord) => new Tmapv2.LatLng(coord[1], coord[0])),
            strokeColor: "#FF0000",
            strokeWeight: 5,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="main">
      <div
        id="TMapApp"
        style={{
          height: '50%', // Adjust the height as needed
          width: '100%',
          position: 'fixed',
        }}
      />
      <div>
        <input
          type="text"
          placeholder="출발지 경도"
          value={startX}
          onChange={(e) => setStartX(e.target.value)}
        />
        <input
          type="text"
          placeholder="출발지 위도"
          value={startY}
          onChange={(e) => setStartY(e.target.value)}
        />
        <input
          type="text"
          placeholder="도착지 경도"
          value={endX}
          onChange={(e) => setEndX(e.target.value)}
        />
        <input
          type="text"
          placeholder="도착지 위도"
          value={endY}
          onChange={(e) => setEndY(e.target.value)}
        />
        <button onClick={handleCalculateRoute}>경로찾기</button>
      </div>
    </div>
  );
}

export default Main;
