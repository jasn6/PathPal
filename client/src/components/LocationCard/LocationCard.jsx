import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StarIcon from "@mui/icons-material/Star";
import PlaceIcon from "@mui/icons-material/Place";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Grid } from "@mui/material";
import "./LocationCard.css";

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

function LocationCard({ location, lists, number }) {
  const {
    name = "Unnamed Location",
    address_obj = {},
    web_url = "#",
    phone = "Phone not available",
    rating = "N/A",
    rating_image_url = "",
    num_reviews = 0,
  } = location.locationDetails || {};

  const [anchorEl, setAnchorEl] = useState(null);
  const [added, setAdded] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [expandedReview, setExpandedReview] = useState(null);

  const isDropdownOpen = Boolean(anchorEl);

  const handleAddClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseDropdown = () => setAnchorEl(null);

  const handleListClick = (listId) => {
    setAdded((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId]
    );
    handleCloseDropdown();
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const toggleReadMore = (index) =>
    setExpandedReview((prev) => (prev === index ? null : index));

  const handleCarouselChange = () => setExpandedReview(null);

  const getPhotoUrl = (photo) => {
    if (typeof photo === "string") {
      return photo; // Photo is a direct URL
    }

    if (photo?.images?.original?.url) {
      return photo.images.original.url; // Photo is an object
    }

    if (photo?.image) {
      return photo.image; // Photo is an object with `image` key
    }

    return null; // Return null if no valid URL is found
  };

  return (
    <>
      <Card className="location-card">
        <Box className="header-section">
          <Box
            className="custom-marker"
            style={{
              backgroundColor: "#668F72",
              marginRight: "8px",
            }}
          >
            <Box className="inner-circle">{number}</Box>
          </Box>

          <Typography
            variant="h6"
            className="location-title"
            style={{ flexGrow: 1 }}
          >
            {name}
          </Typography>
          <IconButton
            className="add-to-trip-button"
            onClick={handleAddClick}
            aria-controls={isDropdownOpen ? "dropdown-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen ? "true" : undefined}
            style={{ marginLeft: "16px" }}
          >
            <BookmarkBorderIcon />
          </IconButton>
        </Box>

        <Menu
          id="dropdown-menu"
          anchorEl={anchorEl}
          open={isDropdownOpen}
          onClose={handleCloseDropdown}
          MenuListProps={{
            "aria-labelledby": "add-to-trip-button",
          }}
        >
          {lists.map((listItem) => (
            <MenuItem
              key={listItem._id}
              onClick={() => handleListClick(listItem._id)}
            >
              <ListItemIcon>
                <PlaceIcon
                  style={{
                    color: added.includes(listItem._id) ? "#3f51b5" : "#ccc",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={listItem.name || "(Untitled)"} />
            </MenuItem>
          ))}
          <MenuItem>
            <ListItemIcon>
              <AddCircleOutlineIcon style={{ color: "#0073bb" }} />
            </ListItemIcon>
            <ListItemText primary="New list" />
          </MenuItem>
        </Menu>

        <Grid container className="combined-section" spacing={2}>
          <Grid item xs={7} className="rating-section">
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-start"
              style={{ padding: "16px", backgroundColor: "white" }}
            >
              <Box display="flex" alignItems="center" marginBottom={1}>
                <img
                  src={rating_image_url}
                  alt="Rating"
                  className="rating-icon"
                />
                <Typography
                  variant="h6"
                  className="rating-text"
                  style={{ marginLeft: "8px", fontWeight: "bold" }}
                >
                  {rating}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{
                    marginLeft: "8px",
                  }}
                >
                  ({num_reviews} reviews)
                </Typography>
              </Box>
              {location.locationDetails?.ranking_data?.ranking_string && (
                <Typography
                  variant="body2"
                  className="ranking-text"
                  color="primary"
                >
                  {location.locationDetails.ranking_data.ranking_string}
                </Typography>
              )}
            </Box>
          </Grid>

          {location.photos && location.photos.length > 0 && (
            <Grid
              item
              xs={5}
              onClick={handleOpenModal}
              className="carousel-image-wrapper"
              role="button"
              aria-label="View location photos"
              style={{ cursor: "pointer" }}
            >
              <Box
                className="image-container"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "8px",
                }}
              >
                <img
                  src={getPhotoUrl(location.photos[0])}
                  alt={`${location.name || "Location"} photo`}
                  className="carousel-image"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
                <Box
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    background: "rgba(0, 0, 0, 0.3)",
                    opacity: "0",
                    transition: "opacity 0.3s ease",
                  }}
                  className="image-overlay"
                ></Box>
              </Box>
            </Grid>
          )}
        </Grid>

        {location.reviews && location.reviews.length > 0 && (
          <Box className="reviews-carousel">
            <Carousel
              responsive={responsive}
              containerClass="carousel-container"
              itemClass="carousel-item"
              arrows
              afterChange={handleCarouselChange}
            >
              {location.reviews.map((review, index) => (
                <Box
                  key={index}
                  className={`review-card ${
                    expandedReview === index ? "expanded" : ""
                  }`}
                >
                  <Typography
                    variant="body2"
                    className="review-text"
                    style={{
                      padding: "0 16px",
                    }}
                  >
                    {expandedReview === index
                      ? review.text
                      : `${review.text.substring(0, 200)}...`}
                  </Typography>
                  {review.text.length > 200 && (
                    <Typography
                      variant="body2"
                      onClick={() => toggleReadMore(index)}
                      className="read-more"
                      style={{
                        cursor: "pointer",
                        color: "#0073bb",
                      }}
                    >
                      {expandedReview === index ? "Read Less" : "Read More"}
                    </Typography>
                  )}
                  <Box className="review-footer">
                    <Box className="review-rating">
                      {[...Array(review.rating)].map((_, i) => (
                        <StarIcon key={i} className="star-icon" />
                      ))}
                    </Box>
                    <Typography
                      variant="body2"
                      className="review-user"
                      color="textSecondary"
                    >
                      - {review.user.username}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Carousel>
          </Box>
        )}

        <CardContent className="location-content">
          <Box
            className="combined-info"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Typography variant="body2" className="address-text">
              {address_obj.address_string}
            </Typography>
            {phone && (
              <>
                <Typography variant="body2" className="separator">
                  •
                </Typography>
                <Typography variant="body2" className="phone-text">
                  {phone}
                </Typography>
              </>
            )}
            <Typography variant="body2" className="separator">
              •
            </Typography>
            <Link
              href={web_url}
              target="_blank"
              underline="hover"
              className="review-link"
            >
              Tips and more reviews
            </Link>
          </Box>
        </CardContent>
      </Card>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={isModalOpen}>
          <Box className="modal-content">
            {location.photos && location.photos.length > 0 ? (
              <Carousel
                responsive={responsive}
                containerClass="carousel-container"
                itemClass="carousel-item"
              >
                {location.photos.map((photo, index) => {
                  const photoUrl = getPhotoUrl(photo);
                  if (!photoUrl) return null; // Skip if URL is invalid
                  return (
                    <Box key={index} className="carousel-image-wrapper">
                      <img
                        src={photoUrl}
                        alt={`Location photo ${index + 1}`}
                        className="carousel-modal-image"
                      />
                    </Box>
                  );
                })}
              </Carousel>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No photos available for this location.
              </Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default LocationCard;
