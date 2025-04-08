import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Avatar from "./Avtar";
import uploadFile from "../helper/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name || "",
    profile_pic: user?.profile_pic || "",
  });

  const uploadPhotoRef = useRef();

  useEffect(() => {
    if (user) {
      setData({
        name: user.name || "",
        profile_pic: user.profile_pic || "",
        _id: user._id, // if needed for backend
      });
    }
  }, [user]);


  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenUploadPhoto = () => {
    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const uploadedData = await uploadFile(file);
      setData((prev) => ({
        ...prev,
        profile_pic: uploadedData?.url, // Store URL for backend use
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
      const token = localStorage.getItem("token"); // Retrieve token from local storage

      if (!token) {
        toast.error("Unauthorized: Please log in again.");
        return;
      }

      const response = await axios.post(
        URL,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Add authentication token
            "Content-Type": "application/json",
          },
          withCredentials: true, // Ensure credentials are sent
        }
      );

      toast.success(response.data.message || "Profile updated successfully!");
      if(response.data.success){
        onClose(); // Close modal on success
      }
      window.location.reload(); // Auto-reload after update
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Update failed. Please try again.");
    }
  };

  return (
    <div
      className="position-fixed top-0 bottom-0 start-0 end-0 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center " style={{ zIndex: 70 }}
    >
      <div className="bg-white p-3 rounded shadow-lg w-100 m-2" style={{ maxWidth: "400px" }}>
        <h2 className="fw-semibold">Profile Details</h2>
        <p className="text-muted small">Edit user details</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-control"
              value={data.name}
              onChange={handleOnChange}
            />
          </div>

          <div>
            <label htmlFor="profile_pic">Photo:</label>
            <div className="my-1 d-flex align-items-center gap-2">
              <Avatar width={40} height={40} imageUrl={data.profile_pic} name={data.name} />

              <button
                className="fw-semibold btn btn-outline-primary"
                type="button"
                onClick={handleOpenUploadPhoto}
              >
                Change Photo
              </button>

              <input
                type="file"
                id="profile_pic"
                ref={uploadPhotoRef}
                className="d-none"
                onChange={handleUploadPhoto}
              />
            </div>
          </div>

          <Divider />

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);
