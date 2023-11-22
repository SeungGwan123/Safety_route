import L from "leaflet";

const fasterRoute = ({
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
}) => {
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
  setOsrmPolylines([routes[0].geometry]); // Display the route without CCTV
  mapRef.current.setView([startLat, startLon], 15);
  setCCTVCircles([]); // Remove CCTV markers
  const distanceInKilometers = (routes[0].distance / 1000).toFixed(2); // Format distance with two decimal places
  const durationInSeconds = routes[0].duration;
  const hours = Math.floor(durationInSeconds / 3600); // 초를 시간으로 변환
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  info.style.visibility = "visible";
  setDistance(distanceInKilometers);
  setDuration(`${hours} 시간 ${minutes} 분`);
  const startMarker = L.marker([startLat, startLon], {
    icon: startIcon,
  }).addTo(mapRef.current);
  const endMarker = L.marker([endLat, endLon], {
    icon: destinationIcon,
  }).addTo(mapRef.current);

  startMarker.bindPopup("출발지");
  endMarker.bindPopup("도착지");
};

export default fasterRoute;
