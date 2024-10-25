import React, { useState, useEffect, createRef } from "react";
import { List, arrayMove } from "react-movable";
import {
  FormControl,
  TextField,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./styles.css";

const defaultImageUrl = "/static/images/temp-background.jpeg";

export default function DisplayList({
  listItem,
  listIndex,
  allPlaces,
  setAllPlaces,
  lists,
  setLists,
  childClicked,
}) {
  const [name, setName] = useState(listItem.name);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [elRefs, setElRefs] = useState([]);

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getPlaces = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/list/${listItem._id}/places`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const rearrangePlaces = async (newPlaces) => {
    try {
      await fetch(`http://localhost:3001/api/list/${listItem._id}/rearrange`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newOrder: newPlaces,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async () => {
    try {
      await fetch(`http://localhost:3001/api/list/${listItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
        }),
      });
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3001/api/list/${listItem._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const newPlaces = allPlaces.filter((item, idx) => idx !== listIndex);
      setAllPlaces(newPlaces);
      const newLists = lists.filter((item, idx) => idx !== listIndex);
      setLists(newLists);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEntry = async (location) => {
    try {
      await Promise.all([
        fetch(`http://localhost:3001/api/place/${listItem._id}/${location}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }),
        fetch(
          `http://localhost:3001/api/list/${listItem._id}/${location}/deletePlace`,
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

  const handlePlaceDelete = async (locationId, placeIndex) => {
    try {
      deleteEntry(locationId);
      const updatedPlaces = places.filter((_, idx) => idx !== placeIndex);
      setPlaces(updatedPlaces);

      const updatedAllPlaces = [...allPlaces];
      updatedAllPlaces[listIndex] = updatedPlaces;
      setAllPlaces(updatedAllPlaces);

      rearrangePlaces(updatedPlaces);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlaces();
  }, []);

  useEffect(() => {
    setElRefs((refs) =>
      Array(places.length)
        .fill()
        .map((_, i) => refs[i] || createRef())
    );
  }, [places]);

  useEffect(() => {
    if (childClicked) {
      const indices = childClicked.split("-");
      const listIdx = parseInt(indices[0], 10);
      const placeIdx = parseInt(indices[1], 10);

      if (listIdx === listIndex && elRefs[placeIdx]) {
        elRefs[placeIdx].current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }
  }, [childClicked]);

  if (loading) {
    return <div>Loading..</div>;
  }

  const calculateWidth = () => {
    const baseWidth = 301; // Minimum width in pixels
    const scalingFactor = 11; // Increase in width per character
    return Math.max(baseWidth, name.length * scalingFactor);
  };

  return (
    <Box className="box">
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <FormControl fullWidth className="formControl">
          <TextField
            style={{ width: calculateWidth() }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="standard"
            placeholder="Add a title (e.g., Restaurants)"
            className="textField"
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              handleEdit();
              setIsFocused(false);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon
                    style={{
                      visibility: isHovered || isFocused ? "visible" : "hidden",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>

      <List
        values={places}
        onChange={({ oldIndex, newIndex }) => {
          const newPlaces = arrayMove(places, oldIndex, newIndex);
          const newList = [...allPlaces];
          newList[listIndex] = newPlaces;
          setAllPlaces(newList);
          setPlaces(newPlaces);
          rearrangePlaces(newPlaces);
        }}
        renderList={({ children, props }) => <Box {...props}>{children}</Box>}
        renderItem={({ value, props, index }) => {
          const isExpanded = expandedIndex === index;
          return (
            <Card
              className={`card ${isExpanded ? "expanded" : ""}`}
              {...props}
              key={value.location_id}
            >
              <Grid ref={elRefs[index]} container spacing={0}>
                <Grid item xs={8}>
                  <CardContent className="cardContent">
                    <Typography variant="h6">{value.name}</Typography>
                    <Typography
                      variant="body2"
                      className={`description ${isExpanded ? "expanded" : ""}`}
                    >
                      {value.description || "No description available"}
                    </Typography>
                    {value.description?.length > 100 && (
                      <Box
                        display="flex"
                        alignItems="center"
                        className="expandContainer"
                      >
                        <IconButton
                          onClick={() => toggleExpand(index)}
                          className={`expandIconButton ${
                            isExpanded ? "expanded" : ""
                          }`}
                        >
                          <ExpandMoreIcon
                            className={`expandIcon ${
                              isExpanded ? "expanded" : ""
                            }`}
                          />
                        </IconButton>
                      </Box>
                    )}
                  </CardContent>
                </Grid>
                <Grid item xs={4} className="mediaWrapper">
                  <CardMedia
                    className="media"
                    image={value.photo?.images?.medium?.url || defaultImageUrl}
                    title={value.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="deleteIconWrapper">
                    <IconButton
                      onClick={() =>
                        handlePlaceDelete(value.location_id, index)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            </Card>
          );
        }}
      />
    </Box>
  );
}
