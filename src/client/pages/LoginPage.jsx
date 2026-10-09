import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setUser } = useOutletContext();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username.trim(), password })
        });
        const data = await response.json();

        if (!response.ok) {
            setError(data.error || "Login failed");
            return;
        }

        // Fetch the full user so the rest of the app sees the same shape as /api/me
        const meResponse = await fetch("/api/me");
        setUser(meResponse.ok ? await meResponse.json() : null);
        navigate("/");
    };

    return (
        <main className="login">
            <h1>Board Game Tracker</h1>

            <div className="login-card">
                <p className="login-hint">
                    Sign in with your username and password. If the account doesn't exist yet, it will be created for you.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            required
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <button type="submit" className="login-submit">Sign In / Sign Up</button>
                </form>

                {error && <p className="login-error">{error}</p>}
            </div>
        </main>
    )
}
export default LoginPage;
