import React from "react";
import GoogleMapReact from "google-map-react";
import mapStyles from "./MapStyles";
import "./styles.css";

const Marker = ({ place, text, hovered, color }) => (
  <div
    className={`custom-marker ${hovered ? "hovered" : ""}`}
    style={{
      backgroundColor: color,
    }}
  >
    <div className="inner-circle">{text}</div>
    <div className="tooltip" style={hovered ? { display: "block" } : {}}>
      {place.locationDetails.name}
    </div>
  </div>
);

export default function Map({ coords, locations }) {
  return (
    <div className="mapContainer">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_KEY }}
        defaultCenter={coords}
        defaultZoom={14}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
        margin={[50, 50, 50, 50]}
      >
        {locations.map((location, index) => {
          console.log(
            index,
            location.locationDetails.name,
            location.locationDetails.latitude,
            location.locationDetails.longitude
          );
          return (
            <Marker
              key={index}
              lat={location.locationDetails?.latitude}
              lng={location.locationDetails?.longitude}
              place={location}
              text={index + 1} // Marker text as the index number
              color="blue" // Marker color; customize as needed
            />
          );
        })}
      </GoogleMapReact>
    </div>
  );
}
