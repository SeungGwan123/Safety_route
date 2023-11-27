import socketIOClient from "socket.io-client";
import { Alert } from "./Alert";
import axios from "axios";
import { previousAlert } from "./previousAlert";
import L from "leaflet";
// Create a socket instance outside the function
const socket = socketIOClient("http://localhost:5001");

// Use a flag to track whether the socket connection has been set up
let socketConnectionSetup = false;
export const ChangeMarker = (
  cctvLocation,
  mapRef,
  cctv,
  regularMarker,
  alertRef,
  redIcon,
  socketInstance // Pass the socket instance as an argument
) => {
  // redMarker.remove();
  const markers = [];
  var targetLatLng = L.latLng(37.44692693, 126.693795);
  function deleteMarker() {
    if (regularMarker.getLatLng().equals(targetLatLng)) {
      mapRef.current.removeLayer(regularMarker);
    }
  }

  axios
    .get("http://127.0.0.1:5001/get_latest_warning")
    .then((response) => {
      const warningdata = response.data.data;
      const prevwarn = "위험";
      const redMarker = L.marker([37.44692693, 126.693795], {
        icon: redIcon,
      });

      if (warningdata != null) {
        // 기존 마커 배열 또는 객체에서 찾아서 삭제
        if (redMarker) {
          deleteMarker();
        }
        const popupContent = `
        <div class="custom-popup">
          <p class="popup-title">CCTV 번호: 2150</p>
          <p>WGS84 경도: 126.693795</p>
          <p>WGS84 위도: 37.44692693</p>
          <p>관리기관명: 인천광역시 남동구청</p>
          <p>설치목적: 생활방범</p>
          <p>설치연월:  2018-06</p>
          <p>소재지 도로명주소: 인천광역시 남동구 문화서로3번길 31</p>
          <p>촬영방면정보: ${cctv.촬영방면정보}</p>
          <p>카메라대수: ${cctv.카메라대수}</p>
          <p>카메라화소: 200</p>
          
        </div>
      `;
        previousAlert(
          warningdata.latest_warning[1],
          redMarker,
          mapRef,
          warningdata.latest_warning[2],
          prevwarn
        );

        redMarker.bindPopup(popupContent, {
          maxWidth: 350,
          className: "custom-popup",
        });
        markers.push(redMarker);

        // Now, add the markers to the map
        if (markers.length > 0) {
          mapRef.current.addLayer(markers[0]);
        }
      }
      console.log();
      const setupSocketConnection = () => {
        // Check if the socket connection has already been set up
        if (socketConnectionSetup) {
          console.log("Socket connection has already been set up.");
          return;
        }

        // Check if socketInstance is defined before using it
        if (socket && typeof socket.on === "function") {
          socket.on("connect", () => {
            console.log("Connected to server");
          });

          socket.on("signal", (data) => {
            const cctvdata = data.data;
            const receivedWarning = cctvdata.warning;
            const imagePath = cctvdata.image;

            console.log("Received Data:", cctvdata);
            console.log("Received Warning:", receivedWarning);
            console.log("Image Path:", imagePath);

            if (receivedWarning === "위험") {
              const redMarker = L.marker(cctvLocation, {
                icon: redIcon,
              });
              if (redMarker) {
                deleteMarker();
              }
              console.log(cctv);
              Alert(
                cctvdata.data,
                alertRef,
                imagePath,
                receivedWarning,
                redMarker,
                mapRef,
                warningdata
              );

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
              redMarker.bindPopup(popupContent, {
                maxWidth: 350,
                className: "custom-popup",
              });
              markers.push(redMarker);

              // Now, add the markers to the map
              markers.forEach((marker) => {
                mapRef.current.addLayer(marker);
              });

              return markers;
            } else {
              mapRef.current.removeLayer(redMarker);
              markers.push(regularMarker);

              markers.forEach((marker) => {
                mapRef.current.addLayer(marker);
              });
            }
          });
          // Set the flag to true to indicate that the socket connection has been set up
          socketConnectionSetup = true;
        } else {
          console.error("Socket instance is not valid.");
        }

        return socket;
      };

      // Call setupSocketConnection only once
      setupSocketConnection();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
