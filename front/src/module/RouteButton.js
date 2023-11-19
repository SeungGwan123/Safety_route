import React from "react";
import pedestrianImage from "../components/img/pedestrian.png";
import routeWalk from "../components/img/routewalk.png";
const RouteButton = ({
  setSelectedTab,
  selectedTab,
  startLocationQuery,
  setStartLocationQuery,
  endLocationQuery,
  setEndLocationQuery,
  distance,
  duration,
}) => {
  return (
    <div>
      <div className="direction-tab1"></div>
      <div className="direction-tab2">
        <div
          className="walk"
          onClick={() => setSelectedTab("도보경로")}
          style={{
            color: selectedTab === "도보경로" ? "#258fff" : "initial",
          }}
        >
          도보경로{" "}
        </div>
        <div
          className="safe"
          onClick={() => setSelectedTab("안심경로")}
          style={{
            color: selectedTab === "안심경로" ? "#258fff" : "initial",
          }}
        >
          안심경로
        </div>
      </div>
      <img className="pd" src={pedestrianImage} alt="src"></img>
      <input
        className="start"
        type="text"
        placeholder="출발지"
        value={startLocationQuery}
        onChange={(e) => setStartLocationQuery(e.target.value)}
      />
      <input
        className="end"
        type="text"
        placeholder="도착지"
        value={endLocationQuery}
        onChange={(e) => setEndLocationQuery(e.target.value)}
      />
      <div className="info-cont">
        {distance !== null && duration !== null && (
          <div className="info-content">
            <div className="info-row">
              <span className="info-label">목적지까지 거리:</span>
              <span className="info-value">{distance} km</span>
            </div>
            <div className="info-row">
              <span className="info-label">도보 소요 시간:</span>
              <span className="info-value">{duration} 시간</span>
            </div>
          </div>
        )}
        <img className="routeWalk" src={routeWalk}></img>
      </div>
    </div>
  );
};
export default RouteButton;
