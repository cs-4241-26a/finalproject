import { Routes, Route, Navigate } from "react-router-dom";

import { useModel } from "./context/ModelContext";

import LoginPage from "./pages/LoginPage";
import BoardPage from "./pages/BoardPage";
import PostPage from "./pages/PostPage";


function App() {
  const { model } = useModel();

  if (model.authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {!model.isAuthenticated ? (
        <>
          <Route path="/" element={<LoginPage />} />

          {/* Prevent unauthenticated users from accessing the app */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </>
      ) : (
        <>
          <Route
            path="/board"
            element={<BoardPage />}
          />

          <Route
            path="/post/:postId"
            element={<PostPage />}
          />

          {/* <Route
            path="/account"
            element={<AccountPage />}
          /> */}

          {/* Default authenticated route */}
          <Route
            path="*"
            element={<Navigate to="/board" replace />}
          />
        </>
      )}
    </Routes>
  );
}

export default App;