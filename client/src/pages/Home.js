import axios from 'axios';
import React, { useEffect, useCallback } from 'react';
import BackButton from "../components/BackButton";
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../components/sidebar';
import logo from '../assets/images/favicon/icon.png';
import io from 'socket.io-client';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname === '/';

  const fetchUserDetails = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
      navigate('/email');
      return;
    }

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios.get(URL, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }

    } catch (error) {
      console.log('Error fetching user:', error);
      dispatch(logout());
      navigate('/email');
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token
      }
    });

    socketConnection.on('onlineUser', (data) => {
      console.log('Online users:', data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

  return (
     <div className="d-flex h-100 vh-100 bg-white">
      {/* Sidebar - Always visible on '/' route, hidden on small screens when navigating */}
      {basePath ? (
        <section className="d-block w-50">
          <Sidebar />
        </section>
      ) : (
        <section className="d-none d-md-block " style={{ width: "400px" }}>
          <Sidebar />
        </section>
      )}

      {/* Message Component - Hidden on '/' route */}
      {!basePath && (
        <div>
          <Sidebar />
          <div className="main-content">
            {location.pathname !== '/' && <BackButton />}
            <Outlet />
          </div>
        </div>
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
