import React, { useState, useEffect } from "react";
import { PiUserCircle } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const CheckEmailPage = () => {
  const [data, setData] = useState({ email: "" });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
        setShowInstall(false);
      });
    }
  };


  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;
    console.log("API URL:", URL); // Debugging

    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message || "Registration successful!");

      if (response.data.success) {
        setData({ email: "" });
        navigate("/password",{
          state : response?.data?.data //pass the user data
      });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-90 bg-light"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1403848173/vector/vector-online-chatting-pattern-online-chatting-seamless-background.jpg?s=612x612&w=0&k=20&c=W3O15mtJiNlJuIgU6S9ZlnzM_yCE27eqwTCfXGYwCSo=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        height: "100vh",
      }}
    >
      

      <div
        className="bg-white w-100"
        style={{
          maxWidth: "400px",
          borderRadius: "10px",
          padding: "20px",
          margin: "20px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div className="d-flex justify-content-center align-items-center mb-4">
        <PiUserCircle 
          size={80}
        />
      </div>
        <h3 className="mb-4 text-center">Welcome to Chat App!</h3>
        {showInstall && (
          <button
            className="btn btn-success w-100 mb-3 fw-bold"
            style={{ fontSize: '1.1rem' }}
            onClick={handleInstallClick}
          >
            Install Chat App
          </button>
        )}

        <form className="mx-2" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={data.email}
              onChange={handleOnChange}
              required
              style={{ backgroundColor: "whitesmoke" }}
            />
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold" type="submit">
            Let's Go
          </button>

          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary w-100 fw-bold mb-2"
              onClick={() => navigate('/anonymous')}
            >
              Try Anonymous Chat
            </button>
            <div>
              <span>or </span>
              <Link to="/anonymous" className="text-success text-decoration-underline">
                Access Anonymous Chat
              </Link>
            </div>
          </div>

          <p className="text-center mt-3">
            New User?
            <Link to="/register" className="text-primary text-decoration-none ms-1">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckEmailPage;
