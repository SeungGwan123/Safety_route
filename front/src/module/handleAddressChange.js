import axios from "axios";

export const handleAddressChange = (
  newAddress,
  setMarkerPosition,
  mapRef,
  fetchCCTVData
) => {
  const Nominatim_Base_Url = "https://nominatim.openstreetmap.org/search";

  axios
    .get(Nominatim_Base_Url, {
      params: {
        q: newAddress,
        format: "json",
      },
    })
    .then((response) => {
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const newLatitude = parseFloat(lat);
        const newLongitude = parseFloat(lon);
        setMarkerPosition([newLatitude, newLongitude]);

        if (mapRef.current) {
          mapRef.current.setView([newLatitude, newLongitude], 15);
        }
        fetchCCTVData(newLatitude, newLongitude);
      } else {
        console.error("Address not found.");
        alert("주소가 없습니다 다시 검색해주세요");
      }
    })
    .catch((error) => {
      console.error("Error geocoding address:", error);
    });
};
