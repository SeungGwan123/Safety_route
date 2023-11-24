import L from "leaflet";
import axios from "axios";
export const AlertPopup = (redMarker, mapRef, imagePath) => {
  axios
    .get("http://127.0.0.1:5001/get_latest_warning")
    .then((response) => {
      const data = response.data;

      if (data.code === 200) {
        const latestWarning = data.data.latest_warning;
        const time = latestWarning[0];
        const cctvid = latestWarning[1];
        const image = latestWarning[2];

        console.log(imagePath);
        // 팝업에 대한 div를 저장할 변수
        var popup = null;
        redMarker.on("popupopen", function () {
          // 팝업이 열릴 때마다 기존의 팝업 div를 생성하고 스타일을 설정
          console.log("imagePath:", imagePath);
          var popupContent = `<img src="${image}"> </img>`;
          popup = L.popup({
            content: popupContent,
            className: "warning-popup", // Add your custom class here
          });

          // 팝업을 지도 객체에 추가
          popup.setLatLng([37.44788, 126.69263]).addTo(mapRef.current);
        });

        redMarker.on("popupclose", function () {
          // 팝업이 닫힐 때마다 popupDiv를 숨김 처리
          if (popup) {
            popup.remove();
          }
        });
      } else {
        console.error("Error: Unable to get the latest warning.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};
