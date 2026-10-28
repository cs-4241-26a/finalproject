import { useState } from "react";
import "./App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (result.success) {
      if (result.created) {
        alert("Account created successfully!");
      }

      localStorage.setItem("userId", result.userId);
      window.location.href = "/";
    } else {
      alert("Login failed: " + result.message);
    }
  };

  const handleSignup = async () => {
    if (!username || !password) {
      alert("Please enter a username and password.");
      return;
    }

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Account created successfully!");
      localStorage.setItem("userId", result.userId);
      window.location.href = "/";
    } else {
      alert("Sign up failed: " + result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>College Planner</h1>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>

          <p className="signup-text">
            Don't have an account?{" "}
            <button type="button" onClick={handleSignup}>
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
