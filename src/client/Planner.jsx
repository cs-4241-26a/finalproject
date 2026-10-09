import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlannerModal from './PlannerModal';


export default function Planner() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [items, setItems] = useState([]);

  const loadList = async () => {
    const response = await fetch(`/data?userId=${userId}`);
    if (!response.ok) {
      console.error('Could not load tasks');
      return;
    }
    setItems(await response.json());
  };

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    loadList();
  }, []);

  const send = async (method, body) => {
    const response = await fetch('/data', {
      method: method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({userId, ...body}),
    });
    if (!response.ok) console.error(`${method} /data failed (${response.status})`);
    loadList();
  };

  const handleAdd = (fields) => send('POST', fields);
  const handleSave = (id, fields) => send('PUT', {id, ...fields});
  const handleDelete = (id) => send('DELETE', {id});

  const weekDates = getWeekDates();

  const days = [
    'Sunday', 
    'Monday', 
    'Tuesday', 
    'Wednesday', 
    'Thursday', 
    'Friday', 
    'Saturday'
  ];

  return (
    <main>
      <h1>Planner</h1>

      <table>
        <thead>
          <tr>
            {weekDates.map((date) => (
              <th key={toKey(date)}>
                {days[date.getDay()]}
                <div>
                  {date.getMonth() + 1}/{date.getDate()}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {weekDates.map((date) => {
              const key = toKey(date);
              const dayTasks = items
                .filter((item) => String(item.deadline).slice(0, 10) === key)
                .sort((a, b) => String(a.deadline).localeCompare(String(b.deadline)));

              return (
                <td key={key} style={{ minWidth: 175 }}>
                  {dayTasks.length === 0 && <p>No tasks</p>}
                  {dayTasks.map((item) => (
                    <TaskItem
                      key={item._id}
                      item={item}
                      onDelete={handleDelete}
                      onSave={handleSave}
                    />
                  ))}
                  <PlannerModal date={key} onAdd={handleAdd} />
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      <a href="/">Back Home</a>
    </main>
  );
}


//Task component:
function TaskItem({ item, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [task, setTask] = useState(item.task);
  const [category, setCategory] = useState(item.category);
  const [deadline, setDeadline] = useState(item.deadline);

  if (editing) {
    return (
      <div>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="classes">Classes</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button
          onClick={() => {
            onSave(item._id, { task, category, deadline });
            setEditing(false);
          }}
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <div>
      <div>{item.task}</div>
      <span className={`badge ${categoryColor(item.category)}`}>{item.category}</span>
      <small>{String(item.deadline).slice(11, 16)}</small>
      <div>
        <button onClick={() => setEditing(true)}>
          Edit
        </button>
        <button onClick={() => onDelete(item._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}




//Getting date
function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}


//Getting all 7 days
function getWeekDates() {
  const today = new Date();
  const sunday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay()
  );
  return Array.from({ length: 7 }, (_, i) =>
    new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i)
  );
}

//Category colors
function categoryColor(category) {
  switch (category) {
    case 'classes': return 'bg-primary';
    case 'work': return 'bg-danger';
    case 'personal': return 'bg-success';
    default: return 'bg-secondary';
  }
}