import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import RouteButton from "./RouteButton";
import fasterRoute from "./fasterRoute";
import safetyRoute from "./safetyRoute";
const DirectionUpdate = ({
  setSelectedTab,
  selectedTab,
  distance,
  setDistance,
  duration,
  setDuration,
  mapRef,
  startLocationQuery,
  setStartLocationQuery,
  endLocationQuery,
  setEndLocationQuery,
  alertRef,
  removeMarkers,
  fetchLocationCoordinates,
  setOsrmPolylines,
  setCCTVCircles,
}) => {
  // const [socketData, setSocketData] = useState(null);

  // useEffect(() => {
  //   const socket = socketIOClient("http://localhost:5001");

  //   socket.on("connect", () => {
  //     console.log("Connected to server");
  //   });

  //   socket.on("signal", (data) => {
  //     // Store the received data in the state
  //     setSocketData(data.data);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  return (
    <div className="nav-direction">
      <RouteButton
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        distance={distance}
        setDistance={setDistance}
        duration={duration}
        setDuration={setDuration}
        startLocationQuery={startLocationQuery}
        setStartLocationQuery={setStartLocationQuery}
        endLocationQuery={endLocationQuery}
        setEndLocationQuery={setEndLocationQuery}
      />
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
              console.log(response.data.data);
              if (
                response.data.data &&
                response.data.data.OSRM_response &&
                response.data.data.OSRM_response.routes
              ) {
                const routes = response.data.data.OSRM_response.routes;
                console.log(response.data.data);
                if (selectedTab === "도보경로") {
                  // Handle when the "도보경로" tab is selected
                  fasterRoute({
                    setOsrmPolylines,
                    mapRef,
                    startLat,
                    startLon,
                    endLat,
                    endLon,
                    setCCTVCircles,
                    routes,
                    setDistance,
                    setDuration,
                    info,
                  });
                } else {
                  // Handle when the "안심경로" tab is selected
                  // ... Your existing code ...

                  if (routes.length > 0) {
                    safetyRoute(
                      routes,
                      startLat,
                      startLon,
                      endLat,
                      endLon,
                      setOsrmPolylines,
                      mapRef,
                      setCCTVCircles,
                      setDistance,
                      setDuration,
                      alertRef,
                      response,
                      info
                    );
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
  );
};
export default DirectionUpdate;
