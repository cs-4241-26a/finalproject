import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./components/Topbar";

function App() {
  // The logged in user, or null if signed out
  const [user, setUser] = useState(null);
  // False until the first /api/me check finishes, so pages don't treat "still loading" as "signed out"
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/me");
      setUser(response.ok ? await response.json() : null);
      setUserLoaded(true);
    };
    fetchUser();
  }, []);

  return (
    <>
      <Topbar user={user} setUser={setUser} />
      <div style={{paddingTop: "80px"}}> {/* Need this to prevent topbar from covering page content */}
        <Outlet context={{ user, setUser, userLoaded }} />
      </div>
    </>
  );
}

export default App;
