function JobApplicationForm({ form, message, onChange, onSubmit }) {
  return (

    <section className="form-section mb-4">
      <h2>Add a new application</h2>
      <p>Track &amp; manage your job applications easily!</p>

      <form onSubmit={onSubmit}>

        <label htmlFor="company">Company Name (required): </label>

        <input
          type="text"
          id="company"
          name="company"
          className="form-control"
          value={form.company}
          onChange={onChange}
          required
        />

        <br />

        <label htmlFor="role">Role (required): </label>

        <input
          type="text"
          id="role"
          name="role"
          className="form-control"
          value={form.role}
          onChange={onChange}
          required
        />

        <br />

        <label htmlFor="date-applied">Date Applied (required): </label>

        <input
          type="date"
          id="date-applied"
          name="dateApplied"
          className="form-control"
          value={form.dateApplied}
          onChange={onChange}
          required
        />
        <br />

        <label htmlFor="resume">Resume:</label>
        <input
          type="text"
          id="resume"
          name="resume"
          className="form-control"
          value={form.resume}
          onChange={onChange}
        />
        <br />

        <label htmlFor="status">Current Status(required):</label>

        <select
          id="status"
          name="status"
          className="form-select"
          value={form.status}
          onChange={onChange}
        >

          <option value="applied">Applied</option>
          <option value="interview">Interviewing</option>
          <option value="rejected">Rejected</option>
          <option value="withdraw">Withdrawn</option>
          <option value="offer">Offer</option>

        </select>
        <br />

        <button type="submit" className="btn btn-primary">
          Add Application
        </button>

        <p className="mt-3" role="status" aria-live="polite">
          {message}
        </p>
        
      </form>
    </section>
  );
}

export default JobApplicationForm;
