export const AlertPopup = (redMarker) => {
  var popupDiv = null; // 팝업에 대한 div를 저장할 변수

  redMarker.on("popupopen", function () {
    // 팝업이 열릴 때마다 기존의 팝업 div를 생성하고 스타일을 설정
    popupDiv = document.createElement("div");
  });

  redMarker.on("popupclose", function () {
    // 팝업이 닫힐 때마다 popupDiv를 숨김 처리
    if (popupDiv) {
    }
  });
};
