import axios from "axios";
import L from "leaflet";
import { handleResponseData } from "./HandleResponseData";
let count = 0;

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

        handleResponseData(cctv, cctvLocation, mapRef, cctvIcon, alertRef);
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
