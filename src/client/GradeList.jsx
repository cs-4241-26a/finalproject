import React from 'react'

const GradeList = ({ entry }) => {
  return (
    <div>
      <li>
        <strong>assignment type:</strong> {entry.assignmenttype} <br/> 
        <strong>grade:</strong> {entry.gradeletter} <br/> 
        <strong>comments:</strong> {entry.cmts} <br/> 
        <br/>
      </li>
    </div>
  )
}

export default GradeList;