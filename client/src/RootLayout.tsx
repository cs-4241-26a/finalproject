import { ClerkProvider } from "@clerk/react";
import { Route, Routes, useNavigate } from "react-router";
import HomePage from "./pages/Homepage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ResultsPage from "./pages/ResultsPage.tsx";
import { BookmarksProvider } from "./BookmarksContext";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const appearance = {
  variables: {
    colorPrimary: "#0f766e",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
  },
};

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={appearance}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <title>Utilicheck</title>
      <BookmarksProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results/:userInput" element={<ResultsPage />} />
          <Route path="/sign-in/*" element={<LoginPage />} />
        </Routes>
      </BookmarksProvider>
    </ClerkProvider>
  );
}
