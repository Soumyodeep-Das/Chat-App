import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadFile from "../helper/uploadFile"; // Utility function to upload files
import { Link , useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });

  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadedData = await uploadFile(file);
      console.log("Uploaded Photo:", uploadedData);
      
      const fileName = file.name; // Extract file name
      const uploadedFileUrl = uploadedData?.secure_url || ""; // Get Cloudinary URL

      setUploadPhoto(fileName); // Show only file name in UI
      setData((prev) => ({
        ...prev,
        profile_pic: uploadedFileUrl, // Store URL for backend use
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPhoto(null);
    setData((prev) => ({
      ...prev,
      profile_pic: "",
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      console.log("Response:", response);
      toast.success(response.data.message || "Registration successful!");

      if (response.data.success) {
        setData({
        // Reset form data on successful registration
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        });
        navigate("/email"); // Redirect to email page
             
      } else {
        toast.error(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");

      
    }

    console.log("User Data:", data);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-90 bg-light"
      style={{
        backgroundImage: "url('https://media.istockphoto.com/id/1403848173/vector/vector-online-chatting-pattern-online-chatting-seamless-background.jpg?s=612x612&w=0&k=20&c=W3O15mtJiNlJuIgU6S9ZlnzM_yCE27eqwTCfXGYwCSo=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        height: "100vh"
      }}>
      <div className="bg-white w-100 "
        style={{ maxWidth: "400px", borderRadius: "10px", padding: "20px", margin: "20px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
        <h3 className="mb-4 text-center">Welcome to Chat App!</h3>

        <form className="mx-2" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name:</label>
            <input type="text" id="name" name="name" className="form-control" placeholder="Enter your name" value={data.name} onChange={handleOnChange} required style={{ backgroundColor: "whitesmoke" }} />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input type="email" id="email" name="email" className="form-control" placeholder="Enter your email" value={data.email} onChange={handleOnChange} required style={{ backgroundColor: "whitesmoke" }} />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input type="password" id="password" name="password" className="form-control" placeholder="Enter your password" value={data.password} onChange={handleOnChange} required style={{ backgroundColor: "whitesmoke" }} />
          </div>

          <div className="d-flex flex-column gap-2 mb-3">
            <label htmlFor="profile_pic" className="form-label">Photo:</label>
            <div className="border rounded d-flex justify-content-center align-items-center p-3 bg-light hover-border-primary"
              style={{ height: "56px", cursor: "pointer", position: "relative" }}
              onClick={() => document.getElementById("profile_pic").click()}>
              <p className="small mb-0">
                {uploading ? "Uploading..." : uploadPhoto ? `Uploaded: ${uploadPhoto}` : "Upload profile photo"}
              </p>
              {uploadPhoto && (
                <button className="btn btn-light ms-2" onClick={handleClearUploadPhoto}>
                  <IoClose />
                </button>
              )}
            </div>
            <input type="file" id="profile_pic" name="profile_pic" className="form-control" hidden onChange={handleUploadPhoto} />
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold" type="submit">Register</button>

          <p className="text-center mt-3">Already have an account?
            <Link to="/email" className="text-primary text-decoration-none ms-1">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
