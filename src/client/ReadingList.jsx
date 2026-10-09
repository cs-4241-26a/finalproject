import React, { useState } from "react";

function ReadingList({ readings, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (reading) => {
    setEditingId(reading._id);
    setEditData({ ...reading });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveEdit = () => {
    onUpdate(editData);
    setEditingId(null);
    setEditData({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="reading-list-section">
      <h2 className="mb-3">My Reading List</h2>

      {readings.length === 0 ? (
        <p className="reading-empty-text">
          No readings added yet. Click "+ Add Reading" to get started.
        </p>
      ) : (
        <div className="table-responsiv reading-table-container">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Class</th>
                <th>Type</th>
                <th>Progress</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {readings.map((reading) => (
                <tr key={reading._id}>
                  {editingId === reading._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="title"
                          className="form-control form-control-sm"
                          value={editData.title}
                          onChange={handleChange}
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          name="course"
                          className="form-control form-control-sm"
                          value={editData.course}
                          onChange={handleChange}
                        />
                      </td>

                      <td>
                        <select
                          name="type"
                          className="form-select form-select-sm"
                          value={editData.type}
                          onChange={handleChange}
                        >
                          <option value="Textbook">Textbook</option>
                          <option value="Book">Book</option>
                          <option value="Article">Article</option>
                          <option value="Research Paper">Research Paper</option>
                          <option value="Chapter">Chapter</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>

                      <td>
                        <div className="d-flex gap-1 align-items-center">
                          <input
                            type="number"
                            name="pagesRead"
                            className="form-control form-control-sm"
                            min="0"
                            value={editData.pagesRead}
                            onChange={handleChange}
                          />

                          <span>/</span>

                          <input
                            type="number"
                            name="totalPages"
                            className="form-control form-control-sm"
                            min="1"
                            value={editData.totalPages}
                            onChange={handleChange}
                          />
                        </div>
                      </td>

                      <td>
                        <input
                          type="date"
                          name="dueDate"
                          className="form-control form-control-sm"
                          value={editData.dueDate}
                          onChange={handleChange}
                        />
                      </td>

                      <td>
                        <select
                          name="status"
                          className="form-select form-select-sm"
                          value={editData.status}
                          onChange={handleChange}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      <td>
                        <input
                          type="text"
                          name="notes"
                          className="form-control form-control-sm"
                          value={editData.notes || ""}
                          onChange={handleChange}
                        />
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={saveEdit}
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        {reading.url ? (
                          <a
                            href={reading.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {reading.title}
                          </a>
                        ) : (
                          reading.title
                        )}
                      </td>

                      <td>{reading.course}</td>
                      <td>{reading.type}</td>
                      <td>{reading.percentComplete}%</td>
                      <td>
                        {reading.dueDate
                          ? new Date(
                              `${reading.dueDate}T00:00:00`
                            ).toLocaleDateString("en-US")
                          : "—"}
                      </td>
                      <td>{reading.status}</td>
                      <td>{reading.notes || "—"}</td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => startEdit(reading)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onDelete(reading._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReadingList;