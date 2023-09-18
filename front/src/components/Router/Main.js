import React from 'react';
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet';
import { useEffect } from 'react';
import "leaflet/dist/leaflet.css"
import "../styles/style.scss";


function Main() {
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
  function Route(){
    const address= document.querySelector(".input-address")
    const searchIcon=document.querySelector(".Search")
    const start=document.querySelector(".start")
    const end=document.querySelector(".end")
    const route=document.querySelector(".route-button")
    address.style.visibility="hidden"
    searchIcon.style.visibility="hidden"
    start.style.visibility="visible"
    end.style.visibility="visible"
    route.style.visibility="visible"

  }
  return (
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
  <div className='logo'><li>로고</li></div>
  <div className='menu-button' style={{background:"#258fff", color:"#fff"}}><li>검색</li></div>
  <div className='menu-button' onClick={Route}><li>길찾기</li></div>
  <div className='menu-button'><li>CCTV</li></div>
  
 
</div>
<div className="menu">
        <div className='nav'>
        <button className='route'>도보경로</button>
        <button className='Safety-route'>안심도보경로</button>
        <input className='input-address'
          type="text"
          placeholder="주소를 입력하세요"
        />
        <div className='Search' ></div>
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

export default Main;
