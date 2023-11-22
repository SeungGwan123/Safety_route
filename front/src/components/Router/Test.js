import React, { useEffect } from "react";
import socketIOClient from "socket.io-client";

const Test = () => {
  useEffect(() => {
    const socket = socketIOClient("http://localhost:5001");

    // Replace with your Flask server address

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("signal", (data) => {
      console.log("Received signal from server:", data);
      // Handle the received data as needed in your React app
    });

    return () => {
      socket.disconnect(); // Disconnect when the component unmounts
    };
  }, []); // Empty dependency array ensures useEffect runs once on mount

  return <div>hello</div>;
};

export default Test;
