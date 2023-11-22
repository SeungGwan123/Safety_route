import axios from "axios";
import L from "leaflet";
import { handleResponseData } from "./HandleResponseData";
import socketIOClient from "socket.io-client";
let globalSocket;
let count = 0;
const cleanup = () => {
  if (globalSocket) {
    globalSocket.disconnect();
  }
};
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
const setupSocketConnection = (
  cctv,
  cctvLocation,
  mapRef,
  [startLat, startLon],
  alertRef,
  warning,
  cctvIcon
) => {
  const socket = socketIOClient("http://localhost:5001");

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("signal", (data) => {
    const cctvdata = data.data;
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
  });

  return socket;
};

const safetyRoute = async (
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
  cleanup(); // Clean up existing connections

  const processedCctvNumbers = new Set(); // Set to keep track of processed cctv numbers

  if (
    response.data.data.near_cctv &&
    Array.isArray(response.data.data.near_cctv)
  ) {
    const maxCctvIndex = response.data.data.near_cctv.reduce(
      (maxIndex, set, currentIndex) => {
        return set.length > response.data.data.near_cctv[maxIndex].length
          ? currentIndex
          : maxIndex;
      },
      0
    );

    const selectedRoute = routes[maxCctvIndex];
    const polylines = selectedRoute.geometry;
    const distance = selectedRoute.distance;
    const duration = selectedRoute.duration;

    setOsrmPolylines([polylines]);

    response.data.data.near_cctv[maxCctvIndex].forEach((cctv) => {
      if (cctv.WGS84경도 && !processedCctvNumbers.has(cctv.번호)) {
        processedCctvNumbers.add(cctv.번호);

        const latitude = parseFloat(cctv.WGS84위도);
        const longitude = parseFloat(cctv.WGS84경도);
        const cctvLocation = [latitude, longitude];
        const warning = "위험";

        const socket = setupSocketConnection(
          cctv,
          cctvLocation,
          mapRef,
          [startLat, startLon],
          alertRef,
          warning,
          cctvIcon
        );

        globalSocket = socket;
      }
    });

    setDistance((distance / 1000).toFixed(2));
    setDuration(
      `${Math.floor(duration / 3600)} 시간 ${Math.floor(
        (duration % 3600) / 60
      )} 분`
    );

    if (count === 0) {
      mapRef.current.setView([startLat, startLon], 15);
      count += 1;
    }

    info.style.visibility = "visible";

    const startMarker = L.marker([startLat, startLon], {
      icon: startIcon,
    }).addTo(mapRef.current);
    const endMarker = L.marker([endLat, endLon], {
      icon: destinationIcon,
    }).addTo(mapRef.current);

    startMarker.bindPopup("출발지");
    endMarker.bindPopup("도착지");
  }
};

export default safetyRoute;
