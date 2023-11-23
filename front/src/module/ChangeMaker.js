import L from "leaflet";
import socketIOClient from "socket.io-client";
import { Alert } from "./Alert";
import { AlertPopup } from "./AlertPopup";
export const ChangeMarker = (
  cctvLocation,
  mapRef,
  cctv,
  regularMarker,
  alertRef,
  redMarker
) => {
  redMarker.remove();
  const setupSocketConnection = () => {
    const socket = socketIOClient("http://localhost:5001");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("signal", (data) => {
      const cctvdata = data.data;
      console.log(cctvdata);

      const markers = [];
      if (cctv.번호 == cctvdata) {
        Alert(cctvdata, alertRef, redMarker);
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
        AlertPopup(redMarker);
        markers.push(redMarker);

        // Now, add the markers to the map
        if (markers.length > 0) {
          mapRef.current.addLayer(markers[0]);
        }
        mapRef.current.removeLayer(regularMarker);

        return markers;
      } else {
        mapRef.current.removeLayer(redMarker);
        markers.push(regularMarker);
        if (markers.length > 0) {
          mapRef.current.addLayer(markers[0]);
        }
      }
    });

    return socket;
  };
  setupSocketConnection();
};
