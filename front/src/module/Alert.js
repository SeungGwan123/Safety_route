import L from "leaflet";
import mp3 from "../components/audio/99AB9F405F75661818.mp3";
const MAX_ARRAY_LENGTH = 5;
const imagePathArray = [];
let popup = null; // Declare popup outside the Alert function

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

  // Check if the component associated with alertRef is mounted
  if (!document.body.contains(alertRef.current)) {
    console.error("Alert component is not mounted");
    return;
  }
  const audio = new Audio(mp3);
  audio.play();
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0; // Reset the audio to the beginning
  }, 2000);
  const popupImages = [];
  alertRef.current.innerHTML = `CCTV 번호: ${cctvdata}`;
  alertRef.current.classList.add("show");

  // Push imagePath to the external imagePathArray
  imagePathArray.push(imagePath);
  imagePathArray[0] =
    "https://img.sbs.co.kr/newimg/news/20210923/201594290_1280.jpg";
  imagePathArray[1] =
    "https://img.etnews.com/news/article/2023/07/13/news-p.v1.20230713.3ba34c8fefed4aefb8b413c2b7ef8915_P1.jpg";
  // Remove the first element if the array length exceeds the limit
  if (imagePathArray.length > MAX_ARRAY_LENGTH) {
    imagePathArray.shift(); // Remove the first element
    imagePathArray.length = 5;
  }

  console.log("After pushing imagePath:", imagePathArray);

  imagePathArray.forEach((imagePath, index) => {
    popupImages.push(`<img src="${imagePath}" style="display: none;">`);
  });

  setTimeout(() => {
    alertRef.current.classList.remove("show");
  }, 500);

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
      warningInfo.innerHTML = `${cctvdata}번호 ${receivedWarning} 상황`;
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
};
