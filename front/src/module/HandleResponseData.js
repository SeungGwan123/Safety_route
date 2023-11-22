import L from "leaflet";
export const handleResponseData = (
  cctvdata,
  cctv,
  cctvLocation,
  mapRef,
  [startLat, startLon],
  alertRef,
  warning,
  cctvIcon
) => {
  const regularMarker = L.marker(cctvLocation, {
    icon: cctvIcon,
  }).addTo(mapRef.current);
  let redMarker;

  const markers = []; // Create an array to hold the Leaflet marker objects

  if (cctv.번호 === cctvdata) {
    alertRef.current.innerHTML = `cctv 번호: ${cctvdata}`;
    alertRef.current.classList.add("show");
    setTimeout(() => {
      alertRef.current.classList.remove("show");
    }, 2000);
    const redIcon = new L.Icon({
      iconUrl: require("../components/img/redcctv.png"), // URL for your custom red marker icon
      iconSize: [20, 24],
      iconAnchor: [10, 12], // Adjust the anchor point if necessary
    });

    // Create a marker with the red icon
    redMarker = L.marker(cctvLocation, {
      icon: redIcon,
    }).addTo(mapRef.current);
    mapRef.current.removeLayer(regularMarker);

    L.circle(cctvLocation, {
      color: "red",
      fill: false,
      weight: 2,
      radius: 50,
    }).addTo(mapRef.current);

    // Apply custom CSS styles for the popup content
    const popupContent = `
        <div class="custom-popup">
          <p class="popup-title">CCTV 번호: ${cctvdata}</p>
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
      className: "custom-popup",
      // Add a custom CSS class to style the popup
    });
    redMarker.on("popupopen", function () {
      // 팝업이 열릴 때 실행되는 함수

      // 새로운 div를 만들어서 내용을 추가
      var newDiv = document.createElement("div");
      newDiv.innerHTML = "이것은 새로운 div입니다.";

      // body에 새로운 div를 추가
      document.body.appendChild(newDiv);
    });

    markers.push(redMarker); // Add the red marker to the array
  } else {
    // Create a marker with the default icon

    // Create a custom popup content with HTML and CSS styles
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
    if (redMarker) {
      mapRef.current.removeLayer(redMarker);
    } // Add the regular marker to the array
  }

  // Now, add the markers to the map
  if (markers.length > 0) {
    mapRef.current.addLayer(markers[0]);
  }

  return markers; // Return the marker objects if needed
};
