import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Header from "../components/Header/Header";
import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import { usePlacesWidget } from "react-google-autocomplete";
import './MainPage.css';
import './PathPal.mp4';

export default function MainPage() {
  const [userPlans, setUserPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thePlace, setPlace] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const navigate = useNavigate();
  
  // Initialize Google Places Autocomplete
  const { ref: materialRef } = usePlacesWidget({
    apiKey: process.env.REACT_APP_MAPS_KEY,
    onPlaceSelected: (place) => setPlace(place),
    inputAutocompleteValue: "country", // or "address"
  });

  const getUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/plan", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      setUserPlans(data);
    } catch (error) {
      console.error("An error occurred", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!thePlace || !thePlace.formatted_address || !thePlace.geometry) {
      console.error("Please select a valid location from the autocomplete suggestions.");
      return;
    }

    try {
      const unsplashRes = await fetch(
        `https://api.unsplash.com/search/photos?query=${thePlace.formatted_address}&client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`
      );
      const unsplashData = await unsplashRes.json();
      const photoUrl = unsplashData.results[0]?.urls?.regular || "/static/images/temp-background.jpeg";

      const res = await fetch("http://localhost:3001/api/plan/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: "Trip to " + thePlace.formatted_address,
          place: thePlace.formatted_address,
          lat: thePlace.geometry.location.lat(),
          lng: thePlace.geometry.location.lng(),
          fromDate: fromDate ? dayjs(fromDate).toISOString() : null,
          toDate: toDate ? dayjs(toDate).toISOString() : null,
          lists: [],
          photoUrl: photoUrl,
        }),
      });
      const data = await res.json();
      navigate(`/plan/${data._id}`);
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  const onDelete = async (plan_id, planIndex) => {
    try {
      await fetch(`http://localhost:3001/api/plan/${plan_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
    const newPlans = userPlans.filter((item, idx) => idx !== planIndex);
    setUserPlans(newPlans);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) {
    return <div className="MainPage-loading">Loading...</div>;
  }

  return (
    <>
      <video className="MainPage-background-video" autoPlay={true} muted loop>
        <source src={require("./PathPal.mp4")} type="video/mp4" />
      </video>

      <Header />
      <div className="MainPage-box">
        <ImageCarousel userPlans={userPlans} onDelete={onDelete} />
      </div>

      <div className="MainPage-shadow">
        <div className="MainPage-centerContent">
          <div className="MainPage-tripHeader">
            Plan a new trip
          </div>

          <div className="MainPage-inputField">
            <TextField
              fullWidth
              color="secondary"
              variant="outlined"
              placeholder="Enter location"
              InputProps={{
                inputRef: materialRef, // Pass materialRef to inputRef here
              }}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "8px",
                padding: "10px",
                fontSize: "18px",
                color: "#333",
              }}
            />
          </div>

          <div className="MainPage-datePickerContainer">
            <input
              type="date"
              value={fromDate || ''}
              onChange={(e) => setFromDate(e.target.value)}
              className="MainPage-datePicker"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={toDate || ''}
              onChange={(e) => setToDate(e.target.value)}
              className="MainPage-datePicker"
              placeholder="End Date"
            />
          </div>

          <button onClick={handleCreate} className="MainPage-beginButton">
            Begin
          </button>
        </div>
      </div>
    </>
  );
}