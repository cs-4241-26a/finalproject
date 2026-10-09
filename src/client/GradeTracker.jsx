import GradeForm from './GradeForm.jsx';
import GradeList from './GradeList.jsx';
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

function GradeTracker(){
  const userId = localStorage.getItem("userId")
    const [formData, setFormData] = useState({
        userId: userId,
        assignmenttype: '',
        gradeletter: '',
        cmts: ''
      })
      const navigate = useNavigate();
      const [entries, setEntries] = useState([])
      const [updatedGPA, setUpdatedGPA] = useState(0.0) 
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      
      function add(e) {
        e.preventDefault()
        fetch( '/add', {
          method:'POST',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
        })
        .then( response => response.json() )
        .then( json => {
           console.log("Data returned to React on submit:", json)
           setEntries( json.entries )
           setUpdatedGPA(json.updatedGPA)

        })
        fetchInitialData()

      }
      
    
        const fetchInitialData = async () => {
          try {
            const userId = localStorage.getItem("userId")
            const response = await fetch('/read', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({userId: userId})
            })
            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            setEntries(data.entries)

            if (data.gpa && typeof data.gpa === 'object') {
              setUpdatedGPA(Number(data.gpa.GPA) || 0.0)
            } else {
              setUpdatedGPA(Number(data.gpa) || 0.0)
            }

          } catch (error) {
            console.error('Error fetching initial entries:', error);
          }
        }
        useEffect(() => {
          fetchInitialData()

        }, [])
 

      return (
        <div className="App">
          <button onClick={() => navigate("/")}>home</button>
          <h2>Current GPA: {updatedGPA}</h2>
          <GradeForm 
            formData={formData} 
            onChange={handleChange} 
            onAdd={add} 
          />
          
          <ul>
            {entries.map((entry, i) => (
              <GradeList key={i} entry={entry} />
            ))}
          </ul> 
        </div>
      )
    
}

export default GradeTracker;