import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

function App() {
  const [students, setStudents] = useState([
    'Barath', 'Jack', 'vionth', 'Yogesh', 'Siva', 'Udhya', 'kawshik'
  ]);
  const [favourites, setFavourites] = useState(() => {
    const savedFavourites = localStorage.getItem('favourites');
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('none');
  const [newStudent, setNewStudent] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  const addToFavourites = (student) => {
    if (!favourites.includes(student)) {
      const newFavourites = [...favourites, student];
      updateHistory(newFavourites);
      setFavourites(newFavourites);
    }
  };

  const addNewStudent = (e) => {
    e.preventDefault();
    if (newStudent && !students.includes(newStudent)) {
      const newStudents = [...students, newStudent];
      updateHistory(newStudents, 'students');
      setStudents(newStudents);
      setNewStudent('');
    }
  };

  const viewFavourites = () => {
    navigate('/favourites', { state: { favourites } });
  };

  const updateHistory = (newState, type = 'favourites') => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ type, state: type === 'students' ? [...newState] : [...newState] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      if (prevState.type === 'favourites') setFavourites([...prevState.state]);
      else setStudents([...prevState.state]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      if (nextState.type === 'favourites') setFavourites([...nextState.state]);
      else setStudents([...nextState.state]);
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (sortOrder === 'asc') return a.localeCompare(b);
    if (sortOrder === 'desc') return b.localeCompare(a);
    return 0;
  });

  const filteredStudents = sortedStudents.filter(student =>
    student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container pastel-mode">
      <div className="header">
        <h2>List of Students</h2>
      </div>
      <div className="content">
        <div className="student-list">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="none">No Sort</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
          <form onSubmit={addNewStudent} className="add-student-form">
            <input
              type="text"
              placeholder="Add new student..."
              value={newStudent}
              onChange={(e) => setNewStudent(e.target.value)}
              className="add-input"
            />
            <button type="submit" className="add-btn">Add</button>
          </form>
          <button onClick={undo} className="undo-btn" disabled={historyIndex <= 0}>
            Undo
          </button>
          <button onClick={redo} className="redo-btn" disabled={historyIndex >= history.length - 1}>
            Redo
          </button>
          {filteredStudents.map((student, index) => (
            <div key={index} className="student-item">
              <Link to={`/student/${student}`} style={{ marginRight: '10px', color: '#4A2C2A' }}>
                {student}
              </Link>
              <button
                onClick={() => addToFavourites(student)}
                disabled={favourites.includes(student)}
                className="add-btn"
              >
                Add to Favourite
              </button>
              {favourites.includes(student) && (
                <button onClick={viewFavourites} className="view-fav-btn">
                  View Favourite Students
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;