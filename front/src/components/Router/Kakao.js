import React, { useEffect } from 'react';

function Kakao() {
  useEffect(() => {
    var container = document.getElementById('map');
    var options = {
      center: new window.kakao.maps.LatLng(37.376924147295455, 126.63486162967031),
      level: 3
    };

    var map = new window.kakao.maps.Map(container, options);

    // Clean up when the component unmounts
    return () => {
      // Clean up code if needed
    };
  }, []); // Empty dependency array means this effect runs once, like componentDidMount

  return <div className='main'>
    <div id='map' style={{width:'100vw',height:'100vh'}}></div>
  </div>;
}

export default Kakao;
