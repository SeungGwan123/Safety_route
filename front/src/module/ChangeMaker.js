import socketIOClient from "socket.io-client";
import { Alert } from "./Alert";
import axios from "axios";
import { previousAlert } from "./previousAlert";
import L from "leaflet";

const socket = socketIOClient("http://localhost:5001");

// 소켓이 사용여부를 확인 하기 위해 플래그 사용
let socketConnectionSetup = false;
export const ChangeMarker = (
  cctvLocation,
  mapRef,
  cctv,
  regularMarker,
  alertRef,
  redIcon
) => {
  const markers = [];
  var targetLatLng = L.latLng(37.44692693, 126.693795);
  function deleteMarker() {
    if (regularMarker && mapRef && mapRef.current) {
      if (
        regularMarker.getLatLng &&
        typeof regularMarker.getLatLng === "function"
      ) {
        if (regularMarker.getLatLng().equals(targetLatLng)) {
          if (
            mapRef.current.removeLayer &&
            typeof mapRef.current.removeLayer === "function"
          ) {
            mapRef.current.removeLayer(regularMarker);
          } else {
            console.error("mapRef.current does not have a removeLayer method");
          }
        }
      } else {
        console.error("regularMarker does not have a getLatLng method");
      }
    } else {
      console.error("regularMarker or mapRef.current is null or undefined");
    }
  }
  const redMarker = L.marker([37.44692693, 126.693795], {
    icon: redIcon,
  });

  const setupSocketConnection = () => {
    // 소켓이 이미 사용중이면
    if (socketConnectionSetup) {
      console.log("Socket connection has already been set up.");
      return;
    }

    //소켓이 이미 사용중인 체크
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
            mapRef
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

          if (markers && Array.isArray(markers)) {
            markers.forEach((marker) => {
              if (mapRef && mapRef.current) {
                mapRef.current.addLayer(marker);
              } else {
                console.error("mapRef is null or not initialized");
              }
            });
          } else {
            console.error("markers is null or not an array");
          }
          return markers;
        } else {
          mapRef.current.removeLayer(redMarker);
          markers.push(regularMarker);

          markers.forEach((marker) => {
            mapRef.current.addLayer(marker);
          });
        }
      });
      //소켓이 이미 연결되어 있다면
      socketConnectionSetup = true;
    } else {
      console.error("Socket instance is not valid.");
    }

    return socket;
  };

  //호출을 한번만 한다.
  setupSocketConnection();
};
