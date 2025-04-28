import axios from 'axios';
import React, { useEffect, useCallback } from 'react';
import BackButton from "../components/BackButton";
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setUser } from '../redux/userSlice';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/sidebar';
import logo from '../assets/images/favicon/icon.png';
import io from 'socket.io-client';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname === '/';
  const socketConnection = useSocket();

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

    if (!socketConnection) return;

    socketConnection.on('onlineUser', (data) => {
      console.log('Online users:', data);
      dispatch(setOnlineUser(data));
    });

    return () => {
      socketConnection.off('onlineUser');
    };
  }, [dispatch, socketConnection]);

  return (
    <div className="d-flex h-100 vh-100 bg-white">
      {/* Sidebar: visible on desktop, hidden on mobile when chat is open */}
      {basePath ? (
        <section className="d-block w-100 w-md-50">
          <Sidebar />
        </section>
      ) : (
        <section className="d-none d-md-block" style={{ width: '400px' }}>
          <Sidebar />
        </section>
      )}

      {/* Main Content: show only chat on mobile when not on basePath */}
      <div className={`flex-grow-1 h-100 ${!basePath ? 'w-100' : ''} d-flex flex-column`}>
        {/* Show BackButton only when not on basePath and on mobile */}
        {!basePath && (
          <div className="d-block d-md-none bg-white sticky-top" style={{ zIndex: 2 }}>
            <BackButton />
          </div>
        )}
        {/* Chat or Welcome Prompt */}
        <div className="flex-grow-1 d-flex flex-column">
          {basePath ? (
            <div className="d-flex justify-content-center align-items-center flex-column gap-2 bg-light w-100 h-100">
              <div>
                <img src={logo} alt="Logo" width={100} />
              </div>
              <h3 className="text-center text-secondary" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                <span className="text-primary">Chat</span> App
              </h3>
              <p className="fs-5 mt-2 text-secondary">Select user to send message</p>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
