import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  Box,
  Link,
  IconButton,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import "./LocationCard.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

function LocationCard({ location }) {
  const {
    name,
    address_obj,
    web_url,
    phone,
    rating,
    rating_image_url,
    num_reviews,
    see_all_photos,
  } = location;

  const [photos, setPhotos] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
          },
          credentials: "include",
        };
        const response = await fetch(
          "http://localhost:3001/api/placesCache/photos",
          options
        );
        const data = await response.json();
        setPhotos(data.data.map((photo) => photo.images.original.url));
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      }
    }

    fetchPhotos();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
      <Card className="location-card">
        <Box className="header-section">
          <Avatar
            src={rating_image_url}
            className="ranking-avatar"
            alt="Ranking"
          />
          <Typography variant="h6" className="location-title">
            {name}
          </Typography>
          <IconButton className="add-to-trip-button">
            <BookmarkBorderIcon />
          </IconButton>
        </Box>
        <Box className="rating-section">
          <img src={rating_image_url} alt="Rating" className="rating-icon" />
          <Typography variant="body2" className="rating-text">
            {rating} ({num_reviews} reviews)
          </Typography>
        </Box>

        {photos.length > 0 && (
          <Box onClick={handleOpenModal} className="carousel-image-wrapper">
            <img
              src={photos[0]}
              alt={`${name} photo`}
              className="carousel-image"
            />
          </Box>
        )}

        <CardContent className="location-content">
          <Typography
            variant="body2"
            color="textSecondary"
            className="location-description"
          >
            Osaka Castle, a revered structure dating back to 1597 and rebuilt
            since then, is a major attraction in Osaka.
          </Typography>
          <Box className="address-section">
            <LocationOnIcon className="icon" />
            <Typography variant="body2" className="address-text">
              {address_obj.address_string}
            </Typography>
          </Box>
          {phone && (
            <Box className="phone-section">
              <PhoneIcon className="icon" />
              <Typography variant="body2">{phone}</Typography>
            </Box>
          )}
          <Box className="action-links">
            <Link href={web_url} target="_blank" underline="hover">
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
            <Carousel
              responsive={responsive}
              infinite
              containerClass="carousel-container"
              itemClass="carousel-item"
            >
              {photos.map((photo, index) => (
                <Box key={index} className="carousel-image-wrapper">
                  <img
                    src={photo}
                    alt={`Location photo ${index + 1}`}
                    className="carousel-modal-image"
                  />
                </Box>
              ))}
            </Carousel>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default LocationCard;
