import axios from 'axios';
import React, { useEffect, useCallback } from 'react';
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

  // Fetch user details and validate token
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
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Dispatch user data
      dispatch(setUser(response.data.data));

      // Check logout flag
      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }

    } catch (error) {
      console.error('Error fetching user:', error);
      dispatch(logout());
      navigate('/email');
    }
  }, [dispatch, navigate]);

  // Initial fetch on mount
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Socket connection setup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token
      }
    });

    // Listen for online users
    socketConnection.on('onlineUser', (data) => {
      console.log('Online users:', data);
      dispatch(setOnlineUser(data));
    });

    // Store socket connection in Redux
    dispatch(setSocketConnection(socketConnection));

    // Cleanup on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="d-flex h-100 vh-100 bg-white">
      {/* Sidebar Section */}
      {basePath ? (
        <section className="d-block w-50">
          <Sidebar />
        </section>
      ) : (
        <section className="d-none d-md-block" style={{ width: "400px" }}>
          <Sidebar />
        </section>
      )}

      {/* Chat View Section */}
      {!basePath && (
        <section className="w-100">
          <Outlet />
        </section>
      )}

      {/* Placeholder Prompt on home screen */}
      {basePath && (
        <div
          className="d-none d-md-flex justify-content-center align-items-center flex-column gap-2 bg-light"
          style={{ width: "100%", height: "100%" }}
        >
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
