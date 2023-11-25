import L from "leaflet";
import socketIOClient from "socket.io-client";
import { Alert } from "./Alert";
import axios from "axios";
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
  redMarker,
  socketInstance // Pass the socket instance as an argument
) => {
  redMarker.remove();
  axios
    .get("http://127.0.0.1:5001/get_latest_warning")
    .then((response) => {
      const warningdata = response.data;
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

            const markers = [];
            cctv.번호 = 8326;
            if (receivedWarning === "위험") {
              console.log(cctv.번호);
              Alert(
                cctvdata.data,
                alertRef,
                imagePath,
                receivedWarning,
                redMarker,
                mapRef,
                warningdata
              );
              mapRef.current.removeLayer(regularMarker);
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
              if (markers.length > 0) {
                mapRef.current.addLayer(markers[0]);
              }

              return markers;
            } else {
              mapRef.current.removeLayer(redMarker);
              markers.push(regularMarker);

              if (markers.length > 0) {
                mapRef.current.addLayer(markers[0]);
              }
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
