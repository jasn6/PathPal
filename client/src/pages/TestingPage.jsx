import React, { useEffect, useState } from "react";
import LocationCard from "../components/LocationCard/LocationCard";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function TestingPage() {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      credentials: "include",
    };

    fetch("http://localhost:3001/api/placesCache/location-details", options)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setLocationData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" padding={2}>
      {locationData ? (
        <LocationCard location={locationData} />
      ) : (
        <Typography>No data available</Typography>
      )}
    </Box>
  );
}
