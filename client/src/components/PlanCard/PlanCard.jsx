import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import "./PlanCard.css";

export default function PlanCard({ userPlan, isMoving, onDelete, planIndex }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Handle click to navigate to plan details, unless carousel is moving
  function handleClick(e) {
    if (isMoving) {
      e.preventDefault();
      return;
    }
    navigate(`/plan/${userPlan._id}`);
  }

  // Handle delete action and prevent link navigation on icon click
  function handleDelete(e) {
    e.stopPropagation(); // Prevents triggering the <a> link click
    e.preventDefault();
    onDelete(userPlan._id, planIndex);
  }

  return (
    <a
      onClick={handleClick}
      href={`/plan/${userPlan._id}`}
      className="plan-card-link"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`plan-card ${isHovered ? "plan-card-hover" : ""}`}>
        <div
          className="plan-card-media"
          style={{ backgroundImage: `url(${userPlan.photoUrl})` }}
          title={userPlan.title}
        />
        <div className="plan-card-content">
          <h6 className="plan-card-title">{userPlan.title}</h6>
        </div>
        <button
          className={`plan-card-delete-icon ${isHovered ? "visible" : ""}`}
          onClick={handleDelete}
        >
          <DeleteIcon />
        </button>
      </div>
    </a>
  );
}