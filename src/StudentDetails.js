import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function StudentDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem(`notes_${name}`);
    return savedNotes ? JSON.parse(savedNotes) : '';
  });

  useEffect(() => {
    localStorage.setItem(`notes_${name}`, JSON.stringify(notes));
  }, [notes, name]);

  const backToStudents = () => {
    navigate('/');
  };

  const saveNotes = () => {
    localStorage.setItem(`notes_${name}`, JSON.stringify(notes));
    navigate('/');
  };

  return (
    <div className="container pastel-mode">
      <div className="header">
        <h2>Details for {name}</h2>
        <button onClick={backToStudents} className="back-btn">
          Back to Students
        </button>
      </div>
      <div className="content">
        <div className="details-list">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes here..."
            className="notes-input"
          />
          <button onClick={saveNotes} className="save-btn">
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;