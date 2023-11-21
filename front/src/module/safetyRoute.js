import axios from "axios";
import L from "leaflet";
import { handleResponseData } from "./HandleResponseData";
import socketIOClient from "socket.io-client";
let globalSocket;

const destinationIcon = new L.Icon({
  iconUrl: require("../components/img/flag.png"),
  iconSize: [30, 35],
  iconAnchor: [12, 24],
});
const startIcon = new L.Icon({
  iconUrl: require("../components/img/start.png"),
  iconSize: [30, 35],
  iconAnchor: [12, 24],
});
const cctvIcon = new L.Icon({
  iconUrl: require("../components/img/cctv.png"),
  iconSize: [20, 24],
  iconAnchor: [5, 10],
});
const safetyRoute = (
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
) => {
  const setupSocketConnection = () => {
    const socket = socketIOClient("http://localhost:5001");

    // Replace with your Flask server address

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("signal", (data) => {
      console.log("Received signal from server:", data);
      let cctvdata = data.data;
      console.log("hello", cctvdata);
      let maxCctvIndex = 0;
      let maxCctvLength = response.data.data.near_cctv[0].length;

      for (let i = 1; i < response.data.data.near_cctv.length; i++) {
        if (response.data.data.near_cctv[i].length > maxCctvLength) {
          maxCctvLength = response.data.data.near_cctv[i].length;
          maxCctvIndex = i;
        }
      }

      // Use the index to select the corresponding OSRM route
      const selectedRoute = routes[maxCctvIndex];

      const polylines = selectedRoute.geometry;
      const distance = selectedRoute.distance; // Distance in meters
      const duration = selectedRoute.duration;
      setOsrmPolylines([polylines]);
      const selectedCctvSet = response.data.data.near_cctv[maxCctvIndex];
      if (
        response.data.data.near_cctv &&
        Array.isArray(response.data.data.near_cctv)
      ) {
        console.log("Received CCTV Data:", response.data.data.near_cctv);
        // Now, you can set the CCTV data to state
        const cctvCircles = response.data.data.near_cctv.map(
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
                handleResponseData(
                  cctvdata,
                  cctv,
                  cctvLocation,
                  mapRef,
                  [startLat, startLon],
                  alertRef,
                  warning,
                  cctvIcon
                );
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
        const minutes = Math.floor((durationInSeconds % 3600) / 60); // 초를 분으로 변환
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
    });
    globalSocket = socket;

    return socket;
  };
  console.log("hello", globalSocket);
  const socket = setupSocketConnection();
};
export default safetyRoute;
