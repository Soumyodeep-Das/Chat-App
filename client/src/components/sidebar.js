import React, { useEffect, useState } from 'react';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus, FaImage, FaVideo } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import { FiArrowUpLeft } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import Avtar from './Avtar';
import EditUserDetails from './EditUserDetails';
import SearchUser from './SearchUser';
import { logout } from '../redux/userSlice';

const Sidebar = () => {
  const user = useSelector(state => state?.user);
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editUserOpen, setEditUserOpen] = useState(false);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [allUser, setAllUser] = useState([]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('sidebar', user._id);

      socketConnection.on('conversation', (data) => {
        const conversationUserData = data.map((conversationUser) => {
          if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
            return { ...conversationUser, userDetails: conversationUser?.sender };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return { ...conversationUser, userDetails: conversationUser.receiver };
          } else {
            return { ...conversationUser, userDetails: conversationUser.sender };
          }
        });

        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/email");
  };

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
          backgroundColor: "#f1f5f9",
          color: "#475569",
        }}
      >
        <div>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `d-flex justify-content-center align-items-center w-100 py-2 text-decoration-none ${isActive ? "bg-secondary text-white" : "text-dark"}`
            }
            style={{ cursor: "pointer", borderRadius: "0.375rem" }}
          >
            <IoChatbubbleEllipses size={22} />
          </NavLink>

          <div
            className="d-flex justify-content-center align-items-center w-100 py-2"
            onClick={() => setOpenSearchUser(true)}
            title="Add Friend"
            style={{
              cursor: "pointer",
              borderRadius: "0.375rem",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="d-flex flex-column align-items-center">
          <button
            className="btn p-0 mb-2"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
            style={{ border: "none", background: "transparent" }}
          >
            <Avtar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>

          <button
            title="Logout"
            className="btn p-0"
            style={{
              width: "48px",
              height: "48px",
              cursor: "pointer",
              borderRadius: "0.375rem",
              backgroundColor: "transparent",
            }}
            onClick={handleLogout}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <BiLogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="w-100"
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
        }}
      >
        <div className="d-flex align-items-center" style={{ height: "64px" }}>
          <h2 className="fs-4 fw-bold p-4 text-dark">Message</h2>
        </div>

        <div className="bg-light" style={{ backgroundColor: "#e2e8f0", padding: "0.5px" }}></div>

        <div className="overflow-auto p-2" style={{ height: "calc(100vh - 65px)", overflowX: "hidden" }}>
          {allUser.length === 0 ? (
            <div className="mt-5">
              <div className="d-flex justify-content-center align-items-center my-4 text-secondary">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="fs-5 text-center text-muted">Explore users to start a conversation</p>
            </div>
          ) : (
            allUser.map((conv) => (
              <NavLink
                to={`/${conv?.userDetails?._id}`}
                key={conv?._id}
                className="d-flex align-items-center gap-2 py-3 px-2 border-0 rounded text-decoration-none text-dark"
                style={{ cursor: "pointer" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Avtar
                  imageUrl={conv?.userDetails?.profile_pic}
                  name={conv?.userDetails?.name}
                  width={40}
                  height={40}
                />
                <div className="text-truncate">
                  <h6 className="mb-1 fw-semibold text-dark">{conv?.userDetails?.name}</h6>
                  <div className="text-muted small d-flex align-items-center gap-1">
                    {conv?.lastMsg?.imageUrl && (
                      <span className="d-flex align-items-center gap-1">
                        <FaImage />
                        {!conv?.lastMsg?.text && <span>Image</span>}
                      </span>
                    )}
                    {conv?.lastMsg?.videoUrl && (
                      <span className="d-flex align-items-center gap-1">
                        <FaVideo />
                        {!conv?.lastMsg?.text && <span>Video</span>}
                      </span>
                    )}
                    <span className="text-truncate">{conv?.lastMsg?.text}</span>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <span className="badge rounded-circle bg-primary text-white ms-auto d-flex justify-content-center align-items-center" style={{ width: "24px", height: "24px" }}>
                    {conv?.unseenMsg}
                  </span>
                )}
              </NavLink>
            ))
          )}
        </div>
      </div>

      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
