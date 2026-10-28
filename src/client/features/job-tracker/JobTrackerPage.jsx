import { useEffect, useState } from "react";
import JobApplicationForm from "./JobApplicationForm";
import JobApplicationList from "./JobApplicationList";
import {useNavigate} from "react-router-dom";

const emptyApplication = {
  company: "",
  role: "",
  dateApplied: "",
  resume: "",
  status: "applied",
};

function JobTrackerPage() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(emptyApplication);
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`/api/applications?userId=${encodeURIComponent(userId || "")}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load applications. Please log in.");
        }
        return response.json();
      })
      .then(setApplications)
      .catch((error) => setMessage(error.message));
  }, []);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();

    fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to add application.");
        }
        return response.json();
      })
      .then((application) => {
        setApplications((current) => [...current, application]);
        setForm(emptyApplication);
        setMessage("Application added successfully!");
      })
      .catch((error) => setMessage(error.message));
  }

  function updateStatus(id, status) {
    fetch(
      `/api/applications/${id}?userId=${encodeURIComponent(userId || "")}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to update application.");
        }
        return response.json();
      })
      .then((updatedApplication) => {
        setApplications((current) =>
          current.map((application) =>
            application.id === updatedApplication.id
              ? updatedApplication
              : application,
          ),
        );
        setMessage("Application updated successfully!");
      })
      .catch((error) => setMessage(error.message));
  }

  function selectStatus(id, status) {
    setApplications((current) =>
      current.map((application) =>
        application.id === id
          ? { ...application, pendingStatus: status }
          : application,
      ),
    );
  }

  function deleteApplication(id) {
    fetch(
      `/api/applications/${id}?userId=${encodeURIComponent(userId || "")}`,
      { method: "DELETE" },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to delete application.");
        }
        return response.json();
      })
      .then((deletedApplication) => {
        setApplications((current) =>
          current.filter((application) => application.id !== deletedApplication.id),
        );
        setMessage("Application deleted successfully!");
      })
      .catch((error) => setMessage(error.message));
  }

  return (
    <div>
      <button onClick={() => navigate("/")}>home</button>
      <h1 className="text-center my-4">Job Application Tracker</h1>

      <main className="container card p-4 mb-4">
        <JobApplicationForm
          form={form}
          message={message}
          onChange={updateForm}
          onSubmit={submit}
        />

        <JobApplicationList
          applications={applications}
          onStatusChange={selectStatus}
          onUpdate={updateStatus}
          onDelete={deleteApplication}
        />
        
      </main>
    </div>
  );
}

export default JobTrackerPage;
