import L from "leaflet";
import mp3 from "../components/audio/99AB9F405F75661818.mp3";
const MAX_ARRAY_LENGTH = 1;
const imagePathArray = [];
let popup = null; // Declare popup outside the Alert function
let hasAlertBeenCalled = false;
export const previousAlert = (cctvNum, redMarker, mapRef, image, prevwarn) => {
  // Set the flag to true to indicate that the function has been called

  // Check if the component associated with alertRef is mounted

  const popupImages = [];

  // Push imagePath to the external imagePathArray
  imagePathArray.push(image);
  imagePathArray[0] =
    "https://img.sbs.co.kr/newimg/news/20210923/201594290_1280.jpg";
  imagePathArray[1] =
    "https://img.etnews.com/news/article/2023/07/13/news-p.v1.20230713.3ba34c8fefed4aefb8b413c2b7ef8915_P1.jpg";
  // Remove the first element if the array length exceeds the limit
  if (imagePathArray.length > MAX_ARRAY_LENGTH) {
  }

  console.log("After pushing imagePath:", imagePathArray);

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
      warningInfo.classList.add("popup-info"); // Add your custom class here
      warningInfo.innerHTML = `${cctvNum}번호 ${prevwarn} 상황 1시간 유지`;
      var imageContainer = document.createElement("div");
      imageContainer.classList.add("popup-image-container"); // Add your custom class here
      imageContainer.innerHTML = image;

      // Add toggle button and image container to the parent div
      popupContent.appendChild(imageContainer);
      imageContainer.appendChild(warningInfo);
      imageContainer.appendChild(toggleButton);
    });

    popup = L.popup({
      content: popupContent,
      className: "warning-popup", // Add your custom class here
    });

    // Add popup to the map
    popup.setLatLng([37.44788, 126.69263]).addTo(mapRef.current);
  });

  redMarker.on("popupclose", function () {
    // Popup close event
    if (popup) {
      popup.remove();
    }
  });

  // Function to toggle the visibility of all image containers
  function toggleImages(popupContent) {
    const imageContainers = popupContent.querySelectorAll(
      ".popup-image-container img"
    );
    const popupContentDiv = popupContent.querySelectorAll(
      ".popup-image-container button"
    );
    // Adjust the max-height value accordingly
    const postion = ["-100px", "5px", "15px", "25px", "35px"];
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
