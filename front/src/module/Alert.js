export const Alert = (cctvdata, alertRef, redMarker) => {
  // Use the AlertPopup function to handle the popup logic

  // Display the current CCTV number in the alert popup
  alertRef.current.innerHTML = `CCTV 번호: ${cctvdata}`;
  alertRef.current.classList.add("show");

  setTimeout(() => {
    alertRef.current.classList.remove("show");
  }, 500);
};
