import React, { useState } from "react";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const fruitsAndVeggies = [
  "Apple", "Banana", "Carrot", "Tomato", "Mango", "Peach", "Potato", "Broccoli", "Cucumber", "Grape", "Onion", "Pumpkin", "Kiwi", "Radish", "Spinach", "Pear", "Cherry", "Lettuce", "Melon", "Orange"
];

function getRandomName() {
  return fruitsAndVeggies[Math.floor(Math.random() * fruitsAndVeggies.length)];
}

const AnonymousChatEntry = () => {
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [anonName, setAnonName] = useState("");
  const navigate = useNavigate();

  const handleStartAnonymous = async () => {
    setLoading(true);
    const randomName = getRandomName();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/anon-session`, { name: randomName });
      const { sessionId } = response.data;
      setAnonName(randomName);
      setInviteLink(`${window.location.origin}/anon-chat/${sessionId}`);
    } catch (err) {
      alert("Failed to start anonymous chat. Try again later.");
    }
    setLoading(false);
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
        <BackButton />
        <h3 className="mb-4 text-center">Start Anonymous Chat</h3>
        {!inviteLink ? (
          <button className="btn btn-primary w-100 py-2 fw-bold mb-2" onClick={handleStartAnonymous} disabled={loading}>
            {loading ? "Generating..." : "Generate Anonymous Chat Link"}
          </button>
        ) : (
          <div className="mt-4 text-center">
            <p>Your anonymous name: <b>{anonName}</b></p>
            <p>Share this link to chat anonymously:</p>
            <input type="text" className="form-control mb-2" value={inviteLink} readOnly />
            <button className="btn btn-outline-secondary w-100 fw-bold mb-2" onClick={() => navigator.clipboard.writeText(inviteLink)}>
              Copy Link
            </button>
            <div className="mt-3">
              <button className="btn btn-success w-100 fw-bold" onClick={() => navigate(`/anon-chat/${inviteLink.split('/').pop()}`)}>
                Go to Chat Room
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnonymousChatEntry;
