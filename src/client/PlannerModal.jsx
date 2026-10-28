import { useState } from 'react';


export default function PlannerModal({date, onAdd}) {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('classes');
  const [time, setTime] = useState('12:00');

  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ task, category, deadline: `${date}T${time}` });
    setTask('');
    setCategory('classes');
    setTime('12:00');
    setOpen(false);
  };

  return (
    <div>
      <button onClick={() => setOpen(true)}>
        Add a task
      </button>

      {open && ( <div className="planner-modal" onClick={handleClose}>
          <div
            style={{ width: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <p>{date}</p>

              <label>
                Task:
                <input
                  type="text"
                  className="form-control"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  required
                />
              </label>

              <label>
                Category:
                <select className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)} >
                  <option value="classes">Classes</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </select>
              </label>

              <label>
                Time:
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </label>

              <button type="submit">Add</button>

              <button type="button" onClick={handleClose}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}