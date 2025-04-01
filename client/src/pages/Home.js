import React from 'react'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';

const Home = () => {

  const fetchUserDetails = async () => {
    try{
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url : URL,
        widthCredentials : true,
      })
      if(response.data.success){
        console.log("User details fetched successfully:", response.data.user);
      }
      else{
        console.error("Failed to fetch user details:", response.data.message);
      }
    } catch(error){
      console.error("Error fetching user details:", error);
    }
  }

  useEffect(() => {
    fetchUserDetails();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div>
      Home

      {/**  message component */}

      <section>
        <Outlet />
      </section>
    </div>
  )
}

export default Home
