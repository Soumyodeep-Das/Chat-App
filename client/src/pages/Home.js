import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setUser , setOnlineUser} from '../redux/userSlice';
import Sidebar from '../components/sidebar';
import logo from '../assets/images/favicon/icon.png';
import { io } from 'socket.io-client';


const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const token = localStorage.getItem("token");

      const response = await axios.get(URL, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      if (error.response?.status === 401) {
        dispatch(logout());
        navigate("/email");
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch, navigate]);

  //** socket connection */
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      console.log("Online Users:", data);
      dispatch(setOnlineUser(data));
    });

    return () => {
      socketConnection.disconnect();
    }
  }, []);


  const basePath = location.pathname === "/";

  return (
    <div className="d-flex h-100 vh-100 bg-white">
      {/* Sidebar - Always visible on '/' route, hidden on small screens when navigating */}
      {basePath ? (
        <section className="d-block w-25">
          <Sidebar />
        </section>
      ) : (
        <section className="d-none d-md-block " style={{ width: "320px" }}>
          <Sidebar />
        </section>
      )}

      {/* Message Component - Hidden on '/' route */}
      {!basePath && (
        <section className="p-3 w-100">
          <Outlet />
        </section>
      )}

      {/* Message Selection Prompt - Hidden on mobile screens when a message is open */}
      {basePath && (
      <div
    className="d-none d-md-flex justify-content-center align-items-center flex-column gap-2 bg-light"
    style={{ width: "100%", height: "100%" }} >
        <div>
          <img src={logo} alt="Logo" width={100} />
        </div>

        <h3 className="text-center text-secondary" style={{ fontSize: "2rem", fontWeight: "bold" }}>
          <span className="text-primary">Chat</span> App
        </h3>

        <p className="fs-5 mt-2 text-secondary">Select user to send message</p>
      </div>
    )}
    </div>
  );
};

export default Home;
