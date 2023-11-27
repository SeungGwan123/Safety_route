import L from "leaflet";
const MAX_ARRAY_LENGTH = 1;
const imagePathArray = [];
let popup = null;
let hasAlertBeenCalled = false;
export const previousAlert = (cctvNum, redMarker, mapRef, image, prevwarn) => {
  const popupImages = [];

  imagePathArray.push(image);
  if (imagePathArray.length > MAX_ARRAY_LENGTH) {
  }

  popupImages.push(`<img src="${image}" style="display: none;">`);
  redMarker.on("popupopen", function () {
    if (popup) {
      popup.remove();
    }
    var popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");
    popupImages.forEach((image) => {
      const toggleButton = document.createElement("button");
      toggleButton.textContent = `이미지 보기`;
      toggleButton.addEventListener("click", () =>
        toggleImages(imageContainer)
      );
      var warningInfo = document.createElement("div");
      warningInfo.classList.add("popup-info");
      warningInfo.innerHTML = `${cctvNum}번호 ${prevwarn} 상황 1시간 유지`;
      var imageContainer = document.createElement("div");
      imageContainer.classList.add("popup-image-container");
      imageContainer.innerHTML = image;

      popupContent.appendChild(imageContainer);
      imageContainer.appendChild(warningInfo);
      imageContainer.appendChild(toggleButton);
    });

    popup = L.popup({
      content: popupContent,
      className: "warning-popup1",
    });
    popup.setLatLng([37.44788, 126.69263]).addTo(mapRef.current);
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
  if (hasAlertBeenCalled) {
    return;
  }

  hasAlertBeenCalled = true;
};
