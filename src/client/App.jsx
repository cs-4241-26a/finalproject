import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "@zumer/orbit/style";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div
      class="bigbang orbit-example"
      role="img"
      aria-label="5 satellites across 115 degrees"
    >
      <div class="gravity-spot">
        <div class="orbit-2 guide"></div>
        <div class="orbit-4 guide"></div>
        <div class="orbit-6 guide example-ring fit-range">
          <div class="satellite grow-2x">
            <button onClick={() => navigate("/timer")}>study timer</button>
          </div>
          <div class="satellite grow-2x">
            <button onClick={() => navigate('/grade-tracker')}>grade tracker</button>
          </div>
          <div class="satellite grow-2x">
            <button onClick={() => navigate("/job-tracker")}>
              job tracker
            </button>
          </div>
          <div class="satellite grow-2x">
            <button onClick={() => navigate("/reading-tracker")}>
              reading tracker
            </button>
          </div>
          <div class="satellite grow-2x">
            <button onClick={() => navigate("/planner")}>
              planner
            </button>
          </div>
        </div>
        <div class="orbit-0">
          <div class="satellite at-center">
            <div class="capsule example-center">
              <strong>Pluna</strong>
            </div>
          </div>
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default App;