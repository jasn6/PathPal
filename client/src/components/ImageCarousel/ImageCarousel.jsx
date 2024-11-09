import React, { Component } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./ImageCarousel.css"; // Import the CSS file
import PlanCard from "../PlanCard/PlanCard";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

class ImageCarousel extends Component {
  state = { isMoving: false };

  render() {
    const { userPlans, deviceType, onDelete } = this.props;

    return (
      <div className="carousel-container">
        <Carousel
          responsive={responsive}
          ssr
          infinite={false}
          beforeChange={() => this.setState({ isMoving: true })}
          afterChange={() => this.setState({ isMoving: false })}
          deviceType={deviceType}
          containerClass="carousel-inner-container"
          itemClass="carousel-item"
        >
          {userPlans.map((plan, index) => (
            <PlanCard
              userPlan={plan}
              key={plan._id}
              isMoving={this.state.isMoving}
              planIndex={index}
              onDelete={onDelete}
            />
          ))}
        </Carousel>
      </div>
    );
  }
}

export default ImageCarousel;