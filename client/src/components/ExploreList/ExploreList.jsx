import React from "react";
import "./ExploreList.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LocationCard from "../LocationCard/LocationCard";

export default function ExploreList({
  plan,
  type,
  setType,
  locations,
  lists,
  loading,
}) {
  const handleTypeChange = (event) => {
    const newType = event.target.value;
    console.log(`Changing type to: ${newType}`);
    setType(newType);
  };

  return (
    <div className="explore-list-container">
      <FormControl className="explore-list-form" variant="standard">
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={handleTypeChange}>
          <MenuItem value={"restaurants"}>Restaurants</MenuItem>
          <MenuItem value={"attractions"}>Attractions</MenuItem>
          <MenuItem value={"hotels"}>Hotels</MenuItem>
        </Select>
      </FormControl>

      {loading ? (
        <div className="loading-container">
          <p>Loading locations...</p>
        </div>
      ) : locations && locations.length > 0 ? (
        <div className="places-container">
          {locations.map((location, i) => {
            return (
              <LocationCard
                location={location}
                lists={lists}
                key={location.location_id || i}
                number={i + 1}
              />
            );
          })}
        </div>
      ) : (
        <div className="loading-container">
          <p>No locations available.</p>
        </div>
      )}
    </div>
  );
}
