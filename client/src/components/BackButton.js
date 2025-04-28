import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const BackButton = ({ className = "", style = {} }) => {
  const navigate = useNavigate();
  return (
    <button
      className={`btn btn-outline-secondary mb-3 fw-bold d-flex align-items-center ${className}`}
      style={{ minWidth: 40, width: 40, height: 40, justifyContent: 'center', ...style }}
      onClick={() => navigate(-1)}
      type="button"
      aria-label="Go back"
    >
      <IoArrowBack size={24} />
    </button>
  );
};

export default BackButton;
