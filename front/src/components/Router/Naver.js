import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container as MapDiv, NaverMap, Marker, Polyline } from 'react-naver-maps';

function Main() {
  const [userLocation, setUserLocation] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [waypoints, setWaypoints] = useState('');

  const [directionsData, setDirectionsData] = useState(null);

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      });
    } else {
      alert('브라우저가 Geolocation을 지원하지 않습니다.');
    }
  };

  const handleAddressSearch = () => {
    if (searchAddress.trim() === '') {
      alert('주소를 입력하세요.');
      return;
    } else {
      axios
        .get(`http://localhost:3001/geocode?query=${encodeURIComponent(searchAddress)}`)
        .then((response) => {
          const firstAddress = response.data.addresses[0];
          if (firstAddress) {
            setSearchResult(firstAddress);
            const { x, y } = firstAddress;
            setUserLocation({ lat: y, lng: x });
          } else {
            alert('주소를 찾을 수 없습니다.');
          }
        })
        .catch((error) => {
          console.error('주소 검색 오류:', error);
          alert('주소 검색 중 오류가 발생했습니다.');
        });
    }
  };

  const handleGetDirections = () => {
    if (startAddress.trim() === '' || endAddress.trim() === '') {
      alert('출발지와 도착지를 입력하세요.');
      return;
    }

    axios
      .get(`http://localhost:3001/directions`, {
        params: {
          start: startAddress,
          end: endAddress,
          waypoints: waypoints,
        },
      })
      .then((response) => {
        console.log(response.data);
        const directionsData = response.data;
        setDirectionsData(directionsData);
      })
      .catch((error) => {
        console.error('경로 검색 오류:', error);
        alert('경로 검색 중 오류가 발생했습니다.');
      });
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="main">
      <div className="menu">
        <MapDiv
          style={{
            width: '100%',
            height: '600px',
          }}
        >
          <NaverMap defaultCenter={userLocation} defaultZoom={15}>
            {userLocation && <Marker position={userLocation} />}
            {directionsData &&
              directionsData.route &&
              directionsData.route.traoptimal &&
              directionsData.route.traoptimal.length > 0 && (
                <Polyline
                  path={directionsData.route.traoptimal[0].path.map((point) => ({
                    lat: point[1], // 경도 (longitude)
                    lng: point[0], // 위도 (latitude)
                  }))}
                  options={{
                    strokeColor: 'red',
                    strokeWeight: 5,
                  }}
                />
              )}
          </NaverMap>
        </MapDiv>
        <input
          type="text"
          placeholder="주소를 입력하세요"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
        />
        <button onClick={handleAddressSearch}>Search</button>
        {searchResult && (
          <p>
            검색된 주소: {searchResult.roadAddress || searchResult.jibunAddress}
            <br />
            좌표: {searchResult.x}, {searchResult.y}
          </p>
        )}
        <input
          type="text"
          placeholder="출발지"
          value={startAddress}
          onChange={(e) => setStartAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="도착지"
          value={endAddress}
          onChange={(e) => setEndAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="경유지 (옵션)"
          value={waypoints}
          onChange={(e) => setWaypoints(e.target.value)}
        />
        <button onClick={handleGetDirections}>경로 검색</button>
        {directionsData &&
          directionsData.route &&
          directionsData.route.traoptimal &&
          directionsData.route.traoptimal.length > 0 && (
            <div className="distance">
              <h2>경로 정보</h2>
              <p>거리: {directionsData.route.traoptimal[0].summary.distance}m</p>
              <p>예상 시간: {directionsData.route.traoptimal[0].summary.duration}초</p>
            </div>
          )}
      </div>
    </div>
  );
}

export default Main;
