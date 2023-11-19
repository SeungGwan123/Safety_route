import L from "leaflet";

export const handleResponseData = (
  data,
  cctv,
  cctvLocation,
  mapRef,
  [startLat, startLon],
  alertRef,
  warning,
  cctvIcon
) => {
  const markers = []; // Create an array to hold the Leaflet marker objects

  if (cctv.번호 === data.cctv_number && warning === data.risk_level) {
    alertRef.current.innerHTML = `cctv 번호: ${data.cctv_number}`;
    alertRef.current.classList.add("show");
    console.log("if");
    const redIcon = new L.Icon({
      iconUrl: require("../components/img/redcctv.png"), // URL for your custom red marker icon
      iconSize: [20, 24],
      iconAnchor: [10, 12], // Adjust the anchor point if necessary
    });

    // Create a marker with the red icon
    const redMarker = L.marker(cctvLocation, {
      icon: redIcon,
    }).addTo(mapRef.current);

    L.circle(cctvLocation, {
      color: "red",
      fill: false,
      weight: 2,
      radius: 50,
    }).addTo(mapRef.current);

    // Apply custom CSS styles for the popup content
    const popupContent = `
        <div class="custom-popup">
          <p class="popup-title">CCTV 번호: ${cctv.번호}</p>
          <img src=https://image.zdnet.co.kr/2023/07/21/enter72f35aebaa72d84db434a8b952117dff.jpg />
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
    redMarker.bindPopup(popupContent, {
      maxWidth: 350, // Set a maximum width for the popup
      className: "custom-popup", // Add a custom CSS class to style the popup
    });

    markers.push(redMarker); // Add the red marker to the array
  } else {
    console.log("else");
    // Create a marker with the default icon
    const regularMarker = L.marker(cctvLocation, {
      icon: cctvIcon,
    }).addTo(mapRef.current);

    // Create a custom popup content with HTML and CSS styles
    const popupContent = `
        <div class="custom-popup">
          <p class="popup-title">CCTV 번호: ${cctv.번호}</p>
          <img src="http://192.168.174.122:8000/stream.mjpg" />
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

    markers.push(regularMarker); // Add the regular marker to the array
  }

  // Now, add the markers to the map
  markers.forEach((marker) => {
    mapRef.current.addLayer(marker);
  });

  return markers; // Return the marker objects if needed
};
