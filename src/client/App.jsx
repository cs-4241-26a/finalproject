import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "@zumer/orbit/style";

function App() {
  const navigate = useNavigate();

  return (
    <div
      class="bigbang orbit-example"
      role="img"
      aria-label="4 satellites across 115 degrees"
    >
      <div class="gravity-spot">
        <div class="orbit-2 guide"></div>
        <div class="orbit-4 guide"></div>
        <div class="orbit-6 guide example-ring fit-range">
          <div class="satellite grow-2x">
            <button onClick={() => navigate("/timer")}>study timer</button>
          </div>
          <div class="satellite grow-2x">
            <button>grade tracker</button>
          </div>
          <div class="satellite grow-2x">
            <button>job tracker</button>
          </div>
          <div class="satellite grow-2x">
            <button>reading tracker</button>
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
    </div>
  );
}

export default App;
