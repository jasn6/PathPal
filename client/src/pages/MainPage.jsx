import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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

  const { ref: materialRef } = usePlacesWidget({
    apiKey: process.env.REACT_APP_MAPS_KEY,
    onPlaceSelected: (place) => setPlace(place),
    inputAutocompleteValue: "country",
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
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <video className="background-video" autoPlay={true} muted loop>
        <source src={require("./PathPal.mp4")} type="video/mp4" />
      </video>

      <Header />
      <Box className="box">
        {/* Display Existing Trips */}
        <ImageCarousel userPlans={userPlans} onDelete={onDelete} />
      </Box>

      {/* Plan a New Trip Section */}
      <div className="shadow">
        <Box className="newTripSection">
          <Box className="tripHeader">
            <br />Plan a new trip
          </Box>

          <div className="inputField">
            <TextField
              fullWidth
              color="secondary"
              variant="outlined"
              placeholder="Enter location"
              inputRef={materialRef} // Connect the ref directly here
            />
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2} justifyContent="center" mt={2}>
              <Grid item>
                <DatePicker
                  label="Start Date"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  label="End Date"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>

          <Button onClick={handleCreate} variant="contained" className="beginButton" sx={{ mt: 3 }}>
            Begin
          </Button>
        </Box>
      </div>
    </>
  );
}