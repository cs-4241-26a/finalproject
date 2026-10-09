import React, { useState, useEffect } from "react";
import ReadingForm from "./ReadingForm";
import ReadingList from "./ReadingList";
import "./App.css";
import { Link } from "react-router-dom";

function ReadingTracker() {
  const userId = localStorage.getItem("userId");

  const [readings, setReadings] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`/api/readings?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setReadings(data);
      });
  }, []);

  const addReading = (newReading) => {
    fetch("/api/readings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newReading, userId: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setReadings([...readings, data]);
        setShowForm(false);
      });
  };

  const updateReading = (updatedReading) => {
    fetch("/api/readings/" + updatedReading._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...updatedReading, userId: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setReadings(
          readings.map((reading) => (reading._id === data._id ? data : reading))
        );
      });
  };

  const deleteReading = (id) => {
    fetch(`/api/readings/${id}?userId=${userId}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        setReadings(readings.filter((reading) => reading._id !== id));
      }
    });
  };

  return (
    <div className="reading-tracker">
      <div className="reading-tracker-header">
        <div>
          <h1>Reading Tracker</h1>
          <p>Keep track of your assigned readings, deadlines, and progress.</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Reading
        </button>
      </div>

      <ReadingForm
        show={showForm}
        onClose={() => setShowForm(false)}
        onAdd={addReading}
      />

      <div className="reading-list-card">
        <ReadingList
          readings={readings}
          onUpdate={updateReading}
          onDelete={deleteReading}
        />
      </div>

      <div>
        <Link to="/" className="back-home-link">
          ← Back Home
        </Link>
      </div>
    </div>
  );
}

export default ReadingTracker;