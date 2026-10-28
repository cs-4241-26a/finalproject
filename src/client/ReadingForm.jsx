import React, { useState } from "react";

function ReadingForm({ show, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    course: "",
    type: "Textbook",
    url: "",
    pagesRead: "",
    totalPages: "",
    status: "Not Started",
    dueDate: "",
    notes: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    onAdd(formData);

    setFormData({
      title: "",
      author: "",
      course: "",
      type: "Textbook",
      url: "",
      pagesRead: "",
      totalPages: "",
      status: "Not Started",
      dueDate: "",
      notes: "",
    });
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className="modal show d-block reading-form"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5">Add Reading</h2>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p className="text-muted">Fields marked with * are required.</p>

              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  placeholder="Reading title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="author" className="form-label">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  className="form-control"
                  placeholder="Author"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="course" className="form-label">
                  Class / Course *
                </label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  className="form-control"
                  placeholder="Example: CS 4241"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="type" className="form-label">
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="Textbook">Textbook</option>
                  <option value="Book">Book</option>
                  <option value="Article">Article</option>
                  <option value="Research Paper">Research Paper</option>
                  <option value="Chapter">Chapter</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="url" className="form-label">
                  URL
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  className="form-control"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={handleChange}
                />
              </div>

              <div className="reading-pages-row">
                <div className="reading-pages-field">
                  <label htmlFor="pagesRead" className="form-label">
                    Pages Read *
                  </label>
                  <input
                    type="number"
                    id="pagesRead"
                    name="pagesRead"
                    className="form-control"
                    min="0"
                    placeholder="0"
                    value={formData.pagesRead}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="reading-pages-field">
                  <label htmlFor="totalPages" className="form-label">
                    Total Pages *
                  </label>
                  <input
                    type="number"
                    id="totalPages"
                    name="totalPages"
                    className="form-control"
                    min="1"
                    placeholder="100"
                    value={formData.totalPages}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status *
                </label>

                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="dueDate" className="form-label">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  className="form-control"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-control"
                  rows="3"
                  placeholder="Assignment details, chapters to read, reminders, etc."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary">
                Add Reading
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReadingForm;