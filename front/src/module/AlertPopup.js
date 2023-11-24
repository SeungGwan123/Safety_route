import L from "leaflet";
export const AlertPopup = (redMarker, mapRef, imagePath) => {
  // 팝업에 대한 div를 저장할 변수
  var popup = null;
  redMarker.on("popupopen", function () {
    // 팝업이 열릴 때마다 기존의 팝업 div를 생성하고 스타일을 설정
    var popupContent = `<img src="${imagePath}"> </img>`;
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
};
