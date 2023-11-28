import L from "leaflet";
import mp3 from "../components/audio/99E208335F721D5B0B.mp3";

const MAX_ARRAY_LENGTH = 5;
const imagePathArray = [];
let popup = null;

export const Alert = (
  cctvdata,
  alertRef,
  imagePath,
  receivedWarning,
  redMarker,
  mapRef
) => {
  if (!alertRef || !alertRef.current) {
    console.error("Alert reference is null or undefined");
    return;
  }

  if (!document.body.contains(alertRef.current)) {
    console.error("Alert component is not mounted");
    return;
  }
  alertRef.current.innerHTML = `CCTV 번호: ${cctvdata}`;
  alertRef.current.classList.add("show");
  const audio = new Audio(mp3);
  audio.play();
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 2000);

  // 외부 imagePathArray에 imagePath 추가
  imagePathArray.push(imagePath);

  // 이미지 제거 및 팝업 업데이트 처리하는 함수
  function updatePopup() {
    while (imagePathArray.length > MAX_ARRAY_LENGTH) {
      imagePathArray.shift(); // 첫 번째 요소 제거
    }

    const popupImages = imagePathArray.map(
      (imagePath) => `<img src="${imagePath}" style="display: none;">`
    );

    if (popup) {
      popup.setContent(createPopupContent(popupImages));
    }
  }

  // 팝업 컨텐츠 추가
  function createPopupContent(images) {
    var popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");

    images.forEach((image) => {
      const toggleButton = document.createElement("button");
      toggleButton.textContent = `이미지 보기`;
      toggleButton.addEventListener("click", () =>
        toggleImages(imageContainer)
      );

      var warningInfo = document.createElement("div");
      warningInfo.classList.add("popup-info");
      warningInfo.innerHTML = `${cctvdata}번호 ${receivedWarning} 상황`;

      var imageContainer = document.createElement("div");
      imageContainer.classList.add("popup-image-container");
      imageContainer.innerHTML = image;

      popupContent.appendChild(imageContainer);
      imageContainer.appendChild(warningInfo);
      imageContainer.appendChild(toggleButton);
    });

    return popupContent;
  }

  setTimeout(() => {
    alertRef.current.classList.remove("show");
  }, 2000);

  redMarker.on("popupopen", function () {
    updatePopup();

    if (popup) {
      popup.remove();
    }

    popup = L.popup({
      content: createPopupContent(
        imagePathArray.map(
          (imagePath) => `<img src="${imagePath}" style="display: none;">`
        )
      ),
      className: "warning-popup",
    });

    popup.setLatLng([37.44692693, 126.693795]).addTo(mapRef.current);
  });

  redMarker.on("popupclose", function () {
    if (popup) {
      popup.remove();
    }
  });

  function toggleImages(popupContent) {
    const imageContainers = popupContent.querySelectorAll(
      ".popup-image-container img"
    );
    imageContainers.forEach((container) => {
      const currentDisplayStyle = container.style.display;
      container.style.display =
        currentDisplayStyle === "none" ? "block" : "none";
    });
  }
};
