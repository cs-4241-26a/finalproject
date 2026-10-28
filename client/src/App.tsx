import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "./components/Navbar";

export default function App() {
  const [zip, setZip] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.trim().length >= 5) {
      // Redirect the user to the results page for their ZIP
      navigate(`/results/${zip}`);
    }
  };

  return (
    <div className="min-h-svh bg-white text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-3xl p-6 mt-12">
        <h1 className="text-4xl font-semibold mb-4">
          Find utilities for your address
        </h1>
        <p className="text-slate-500 mb-8 text-lg">
          Enter your ZIP code to compare local internet, power, and water
          providers.
        </p>

        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Enter ZIP Code (e.g., 10001)"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            maxLength={5}
          />
          <button
            type="submit"
            className="rounded-lg bg-teal-600 px-8 py-3 text-lg font-medium text-white hover:bg-teal-700 transition-colors"
          >
            Search
          </button>
        </form>
      </main>
    </div>
  );
}
