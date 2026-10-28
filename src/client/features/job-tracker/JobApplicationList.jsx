const statuses = ["applied", "interview", "rejected", "withdraw", "offer"];

function applicationAge(dateApplied) {
  const oneDay = 1000*60*60*24; 
  const appliedDate = new Date(`${dateApplied}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - appliedDate) / oneDay);

  if (diffDays < 0 || Number.isNaN(diffDays)) {
    return "Invalid date";
  }

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "1 day ago";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  }

  if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  return `${Math.floor(diffDays / 365)} years ago`;
}

function JobApplicationList({
  applications,
  onStatusChange,
  onUpdate,
  onDelete,
}) 

{
  return (
    <section className="results-section mb-4">

      <h2>Your Applications</h2>

      {applications.length === 0 ? (
        <p>No results to show</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">

            <caption>Your saved job applications</caption>

            <thead>
              <tr>
                <th scope="col">Company</th>
                <th scope="col">Role</th>
                <th scope="col">Date Applied</th>
                <th scope="col">Resume</th>
                <th scope="col">Status</th>
                <th scope="col">Application Age</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.company}</td>
                  <td>{application.role}</td>
                  <td>{application.dateApplied}</td>
                  <td>{application.resume}</td>
                  <td>

                    <label
                      className="visually-hidden"
                      htmlFor={`status-${application.id}`}
                    >
                      Status for {application.company}
                    </label>

                    <select
                      id={`status-${application.id}`}
                      className="form-select"
                      value={application.pendingStatus || application.status}
                      onChange={(event) =>
                        onStatusChange(application.id, event.target.value)
                      }
                    >


                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}


                    </select>
                  </td>
                  <td>{applicationAge(application.dateApplied)}</td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-success btn-sm me-2"
                      onClick={() =>
                        onUpdate(
                          application.id,
                          application.pendingStatus || application.status,
                        )
                      }
                      aria-label={`Update application for ${application.company}`}
                    >
                      Update
                    </button>


                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(application.id)}
                      aria-label={`Delete application for ${application.company}`}
                    >
                      Delete
                    </button>


                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}
      
    </section>
  );
}

export default JobApplicationList;
