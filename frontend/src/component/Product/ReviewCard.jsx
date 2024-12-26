import Rating from '@mui/material/Rating';
import React from "react";
import profilePng from "../../assets/Profile.png";

const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="flex flex-col items-center p-6 m-4 shadow-lg border border-gray-200 w-80 rounded-md">
      <img src={review.avatar?.url || profilePng} alt="User" className="w-20 h-20 rounded-full mb-4" />
      <p>{review.name}</p>
      <Rating {...options} />
      <span className="text-gray-600 text-sm italic">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;


