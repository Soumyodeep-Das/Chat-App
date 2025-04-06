import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import Avtar from "./Avtar";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser"; // Importing the SearchUser component

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false); // Default state is closed
  const [allUser, setAllUser] = useState([]); // State to hold all users
  const [openSearchUser, setOpenSearchUser] = useState(false); // State to control search user modal

  return (
    <div className="h-100 d-grid bg-white" style={{ gridTemplateColumns: "48px 1fr", height: "100vh" }}>
      {/* Sidebar Container */}
      <div
        className="bg-light d-flex flex-column justify-content-between align-items-center py-3"
        style={{
          width: "48px",
          height: "100vh",
          borderTopRightRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
          backgroundColor: "#f1f5f9", // Equivalent to slate-100 in Tailwind
          color: "#475569", // Equivalent to slate-600
        }}
      >
        <div>
          {/* Chat Icon Link */}
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `d-flex justify-content-center align-items-center w-100 py-2 text-decoration-none ${
                isActive ? "bg-secondary text-white" : "text-dark"
              }`
            }
            style={{ cursor: "pointer", borderRadius: "0.375rem" }} // Equivalent to "rounded"
          >
            <IoChatbubbleEllipses size={25} />
          </NavLink>

          {/* Add User Icon */}
          <div
            className="d-flex justify-content-center align-items-center w-100 py-2"
            onClick={() => setOpenSearchUser(true)} // Open search user modal
            style={{
              cursor: "pointer",
              borderRadius: "0.375rem",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#e2e8f0")
            } // Hover effect
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <FaUserPlus size={25} />
          </div>
        </div>

        {/* User Avatar & Logout */}
        <div className="d-flex flex-column align-items-center">
          {/* User Avatar Button */}
          <button
            className="mx-auto btn p-0"
            title={user?.name}
            onClick={() => setEditUserOpen(true)} // Open edit modal
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <Avtar
            width={40}
            height={40}
            name={user?.name}
            imageUrl={user?.profile_pic}
            userId={user?._id}
            />
          </button>

          {/* Logout Button */}
          <button
            title="Logout"
            className="d-flex justify-content-center align-items-center btn p-0"
            style={{
              width: "48px",
              height: "48px",
              cursor: "pointer",
              borderRadius: "0.375rem",
              backgroundColor: "transparent",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#e2e8f0")
            } // Hover effect
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <BiLogOut size={20} />
          </button>
        </div>
      </div>

      <div className="w-100">
      {/* Header Section */}
      <div className="d-flex align-items-center" style={{ height: "64px" }}>
        <h2 className="fs-4 fw-bold p-4 text-dark">Message</h2> 
      </div>

      {/* Separator Line */}
      <div className="bg-light" style={{ backgroundColor: "#e2e8f0", padding: "0.5px" }}></div>

      {/* Scrollable Content Area */}
      <div 
        className=" overflow-hidden overflow-auto scrollbar" 
        style={{ height: "calc(100vh - 65px)" }}
      >
        {
          allUser.length === 0 && (
            <div className="mt-4">
              <div className="d-flex justify-content-center align-items-center my-4 text-secondary">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="fs-5 text-center text-muted">
                Explore users to start a conversation
              </p>
            </div>
          )

        }
        {/* Message Content */}
      </div>
    </div>


      {/* Edit User Details Modal */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* Search User Modal */}
      {
        openSearchUser &&(
          <SearchUser onClose={() => setOpenSearchUser(false)}/>
        )
      }
    </div>
  );
};

export default Sidebar;
