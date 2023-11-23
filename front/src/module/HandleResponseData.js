import L from "leaflet";
import { ChangeMarker } from "../module/ChangeMaker";
export const handleResponseData = (
  cctv,
  cctvLocation,
  mapRef,
  cctvIcon,
  alertRef
) => {
  const regularMarker = L.marker(cctvLocation, {
    icon: cctvIcon,
  }).addTo(mapRef.current);
  const redIcon = new L.Icon({
    iconUrl: require("../components/img/redcctv.png"), // URL for your custom red marker icon
    iconSize: [20, 24],
    iconAnchor: [10, 12], // Adjust the anchor point if necessary
  });
  const redMarker = L.marker([37.44788, 126.69263], {
    icon: redIcon,
  }).addTo(mapRef.current);
  const markers = [];
  const popupContent = `
        <div class="custom-popup">
          <p class="popup-title">CCTV 번호: ${cctv.번호}</p>
          <p>WGS84 경도: ${cctv.WGS84경도}</p>
          <p>WGS84 위도: ${cctv.WGS84위도}</p>
          <p>관리기관명: ${cctv.관리기관명}</p>
          <p>설치목적: ${cctv.설치목적}</p>
          <p>설치연월: ${cctv.설치연월}</p>
          <p>소재지 도로명주소: ${cctv.소재지도로명주소}</p>
          <p>촬영방면정보: ${cctv.촬영방면정보}</p>
          <p>카메라대수: ${cctv.카메라대수}</p>
          <p>카메라화소: ${cctv.카메라화소}</p>
          
        </div>
      `;

  // Add the custom popup to the marker
  regularMarker.bindPopup(popupContent, {
    minWidth: 350, // Set a minimum width for the popup
    className: "custom-popup", // Add a custom CSS class to style the popup
  });
  markers.push(regularMarker);

  // Now, add the markers to the map
  if (markers.length > 0) {
    mapRef.current.addLayer(markers[0]);
  }

  ChangeMarker(cctvLocation, mapRef, cctv, regularMarker, alertRef, redMarker);

  return markers; // Return the marker objects if needed
};
