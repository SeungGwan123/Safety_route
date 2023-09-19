import React from 'react';
import "../styles/style.scss";
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Direction(){
    useEffect(() => {
        const buttons = document.querySelectorAll('.menu-button');
        
        buttons.forEach(button => {
          button.addEventListener('click', () => {
            buttons.forEach(b => {
              b.style.background = "#fff";
              b.style.color="#000000"
            });
            button.style.background= '#258fff';
            button.style.color="#fff"
          });
        });
        
        return () => {
          buttons.forEach(button => {
            button.removeEventListener('click', () => {
              buttons.forEach(b => {
                b.style.background = "#fff";
                b.style.color="#000000"
              });
              button.style.background= '#258fff';
              button.style.color="#fff"
            });
          });
        };
      }, []);
    return(
        <div className='main'>
          <MapContainer center={[37.5665, 126.9780]} zoom={15} scrollWheelZoom={true} style={{ width: "100%", height: "100vh" }}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[37.5665, 126.9780]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</MapContainer>
<div className='menu-bar'>
  <Link className='logo'>로고</Link>
  <Link className='menu-button' to="/">검색</Link>
  <Link className='menu-button' style={{background:"#258fff", color:"#fff"}} to="/direction">길찾기</Link>
  <Link className='menu-button' to="/cctv">CCTV</Link>
  
 
</div>
        <div className="menu">
        <div className='nav'>
        <div className='direction-tab'>도보경로</div>
        <div className='direction-tab'>안심경로</div>
        <input className='start'
          type="text"
          placeholder="출발지"
        />
        <input className='end'
          type="text"
          placeholder="도착지"
        />
        <button className='route-button' >경로 검색</button>
        </div>
        
      </div>
      </div>
    )

}
export default Direction;