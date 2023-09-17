import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Main() {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `         
        function initTmap() {
            var map = new Tmapv2.Map("TMapApp", {
                center: new Tmapv2.LatLng(37.566481622437934,126.98502302169841),
                zoom:15
            });
        }
        
        initTmap();
   `;
    script.type = "text/javascript";
    script.async = "async";
    document.head.appendChild(script);
    console.log("hello")
    
  }, []);
  return (
    <div className="main">
      <div
        id="TMapApp"
        style={{
          height: "100%",
          width: "100%",
          position: "fixed",
        }}
      />

  
    </div>
  );
}

export default Main;