import React, { useState, useEffect } from "react";
import { IoSearchOutline ,IoClose} from "react-icons/io5";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { toast } from "react-hot-toast";

const SearchUser = ({onClose}) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch users (all or filtered)
  const fetchUsers = async (query = "") => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
    try {
      setLoading(true);
      const response = await axios.post(URL, { search: query });
      setSearchUser(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users initially
  useEffect(() => {
    fetchUsers(); // Fetch all users when the component mounts
  }, []);

  // Fetch filtered users on search input change (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(search.trim());
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div
      className="position-fixed top-0 bottom-0 start-0 end-0 p-2"
      style={{
        background: `linear-gradient(rgba(240, 240, 240, 0.8), rgba(240, 240, 240, 0.8)), 
        url('/mnt/data/image.png') center/cover no-repeat`,
      }}
    >
      <div className="container mt-4">
        {/* Input Search User */}
        <div
          className="bg-white rounded d-flex align-items-center overflow-hidden shadow-sm"
          style={{
            height: "56px",
            maxWidth: "500px",
            margin: "auto",
          }}
        >
          <input
            type="text"
            className="form-control border-0 px-3 mx-2"
            placeholder="Search user by name, email..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ width: "56px", height: "56px" }}
          >
            <IoSearchOutline size={25} />
          </div>
        </div>

        {/* Display Search Results */}
        <div className="d-flex justify-content-center align-items-center mt-4">
          <div
            className="bg-white p-4 rounded shadow-sm text-center w-100"
            style={{
              maxWidth: "500px",
              minHeight: "70px",
              margin: "auto",
            }}
          >
            {/* Show Loading Indicator */}
            {loading ? (
              <Loading />
            ) : (
              <p className="text-center text-success fw-bold">
                {searchUser.length > 0 ? "Users Loaded" : "No users available"}
              </p>
            )}

            {/* Display User Cards */}
            {searchUser.length > 0 && !loading && (
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  paddingRight: "10px",
                }}
              >
                {searchUser.map((user) => (
                  <UserSearchCard key={user._id} user={user} onClose={onClose}/>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div class="position-absolute top-0 end-0 text-primary p-2 fs-4 lg:fs-2 hover-text-white " onClick={onClose}>
            <button>
              <IoClose  style={{cursor:"pointer"}}/>
            </button>
      </div>
    </div>
  );
};

export default SearchUser;
