import React, { useState } from "react";
import Avatar from "./Avtar"; // Ensure the filename matches exactly
import { Link } from "react-router-dom";

const UserSearchCard = ({ user ,onClose}) => {
  const [hover, setHover] = useState(false);

  return (
    <Link to={"/"+user?._id} onClick={onClose}
      className="d-flex align-items-center gap-3 p-3 border rounded shadow-sm"
      style={{
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        backgroundColor: hover ? "#f8f9fa" : "white",
        boxShadow: hover ? "0 4px 10px rgba(0, 0, 0, 0.1)" : "none",
        borderBottom: hover ? "2px solid #0d6efd" : "2px solid transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Avatar */}
      <Avatar width={50} height={50} name={user?.name}  userId={user?._id} imageUrl={user?.profile_pic} />

      {/* User Info */}
      <div className="flex-grow-1">
        <div
          className="fw-semibold text-dark text-truncate"
          style={{ maxWidth: "250px" }}
        >
          {user?.name}
        </div>
        <p
          className="text-muted text-truncate mb-0"
          style={{ maxWidth: "250px" }}
        >
          {user?.email}
        </p>
      </div>
    </Link >
  );
};

export default UserSearchCard;
