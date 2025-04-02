import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setUser } from '../redux/userSlice';
import Sidebar from '../components/sidebar';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
  try {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
    const token = localStorage.getItem("token"); // Retrieve token from localStorage (or cookies)

    const response = await axios.get(URL, {
      withCredentials: true, // Ensures cookies are sent
      headers: {
        Authorization: `Bearer ${token}` // Add token if required
      }
    });

    dispatch(setUser(response.data.data));

    if (response.data.logout) {
      dispatch(logout());
      navigate("/email");
    }

    console.log("User details fetched successfully:", response);
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
  }, [dispatch, navigate]); // FIXED: Added dependencies

  return (
    <div className="d-grid h-100 vh-100 "  style={{ gridTemplateColumns: "320px 1fr" }}>
      <section className='bg-white'>
        <Sidebar/>
      </section>
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
