import React, { useState, useEffect } from "react";
import "./PlaceDetails.css";

const defaultImageUrl = "/static/images/temp-background.jpeg";

export default function PlaceDetails({ plan, place, lists }) {
  const [added, setAdded] = useState([]);
  const [prev, setPrev] = useState([]);

  const getPlacesEntries = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/place/${place.location_id}/${plan}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setPrev(data);
      setAdded(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlacesEntries();
  }, [place]);

  const updateEntries = () => {
    for (let i = 0; i < prev.length; i++) {
      if (added.indexOf(prev[i]) === -1) {
        deleteEntry(prev[i]);
      }
    }
    for (let i = 0; i < added.length; i++) {
      if (prev.indexOf(added[i]) === -1) {
        addEntry(added[i]);
      }
    }
  };

  const deleteEntry = async (listId) => {
    try {
      await Promise.all([
        fetch(
          `http://localhost:3001/api/place/${listId}/${place.location_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        ),
        fetch(
          `http://localhost:3001/api/list/${listId}/${place.location_id}/deletePlace`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        ),
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const addEntry = async (listId) => {
    try {
      await Promise.all([
        fetch("http://localhost:3001/api/place/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            plan: plan,
            location_id: place.location_id,
            listId: listId,
            data: place,
          }),
        }),
        fetch(`http://localhost:3001/api/list/${listId}/addPlace`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            place: place,
          }),
        }),
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { options } = event.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setAdded(selectedValues);
  };

  return (
    <div className="PlaceDetails-card">
      <img
        className="PlaceDetails-image"
        src={place?.photo?.images?.small?.url || defaultImageUrl}
        alt={place.name}
      />
      <div className="PlaceDetails-details">
        <h2 className="PlaceDetails-title">{place.name}</h2>
        <p className="PlaceDetails-subcategory">{place.subcategory_ranking}</p>
      </div>
      <div className="PlaceDetails-actions">
        <label htmlFor="PlaceDetails-select" className="PlaceDetails-label">
          Add To Trip
        </label>
        <select
          id="PlaceDetails-select"
          className="PlaceDetails-select"
          multiple
          value={added}
          onChange={handleChange}
          onBlur={() => updateEntries()}
        >
          {lists.map((listItem) => (
            <option key={listItem._id} value={listItem._id}>
              <input
                type="checkbox"
                checked={added.indexOf(listItem._id) > -1}
                readOnly
              />
              {listItem.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
