import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Box,
  Link,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import "./LocationCard.css";

function LocationCard({ location }) {
  const {
    name,
    address_obj,
    web_url,
    phone,
    rating,
    rating_image_url,
    num_reviews,
    ranking_data,
    subratings,
    see_all_photos,
  } = location;

  return (
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
      <CardMedia
        component="img"
        height="140"
        image={see_all_photos} // Replace with actual image URL
        alt={`${name} photo`}
        className="location-image"
      />
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
        <Divider className="divider" />
        <Box className="action-links">
          <Link href={web_url} target="_blank" underline="hover">
            Tips and more reviews
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}

export default LocationCard;
