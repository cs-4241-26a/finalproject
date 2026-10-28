import React from 'react';

const GradeForm = ({ formData, onChange, onAdd }) => {
  return (
    <form onSubmit={onAdd}>
      <div className='container'>
        <label htmlFor="assignmenttype">Assignment Type: </label>
        <select 
          name="assignmenttype" 
          id="assignmenttype" 
          value={formData.assignmenttype} 
          onChange={onChange}
        >
          <option value="">--Please choose an option--</option>
          <option value="hw">hw</option>
          <option value="quiz">quiz</option>
          <option value="test">test</option>
          <option value="project">project</option>
        </select>
        <br/><br/>
        
        <label htmlFor="gradeletter">Letter Grade: </label>
        <select 
          name="gradeletter" 
          id="gradeletter" 
          value={formData.gradeletter}
          onChange={onChange}
        >
          <option value="">--Please choose an option--</option>
          <option value="a">a</option>
          <option value="b">b</option>
          <option value="c">c</option>
          <option value="d">d</option>
        </select>
        <br/><br/>
        
        <label htmlFor="cmts">Any comments? </label>
        <textarea 
          id="cmts" 
          name="cmts" 
          value={formData.cmts}
          onChange={onChange}
        ></textarea>
        <br/><br/>
        
        <button onClick={onAdd}>add</button>
      </div>
    </form>
  );
};

export default GradeForm