import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './App.css';
import { saveAs } from 'file-saver';

function Favourites() {
  const location = useLocation();
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState(location.state?.favourites || []);

  useEffect(() => {
    setFavourites(location.state?.favourites || []);
  }, [location.state]);

  const removeFromFavourites = (student) => {
    const updatedFavourites = favourites.filter((fav) => fav !== student);
    setFavourites(updatedFavourites);
    navigate('/favourites', { state: { favourites: updatedFavourites } });
    localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
  };

  const clearAllFavourites = () => {
    setFavourites([]);
    navigate('/favourites', { state: { favourites: [] } });
    localStorage.setItem('favourites', JSON.stringify([]));
  };

  const exportFavourites = () => {
    const blob = new Blob([favourites.join('\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'favourites.txt');
  };

  const backToStudents = () => {
    navigate('/');
  };

  const [filterTerm, setFilterTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('none');

  const sortedFilteredFavourites = [...favourites]
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.localeCompare(b);
      if (sortOrder === 'desc') return b.localeCompare(a);
      return 0;
    })
    .filter(fav => fav.toLowerCase().includes(filterTerm.toLowerCase()));

  return (
    <div className="container pastel-mode">
      <div className="header">
        <h2>Favourite Students</h2>
        <button onClick={backToStudents} className="back-btn">
          Back to Students
        </button>
      </div>
      <div className="content">
        <div className="favourite-list">
          <input
            type="text"
            placeholder="Filter favourites..."
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
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
          <button onClick={exportFavourites} className="export-btn">
            Export List
          </button>
          <button onClick={clearAllFavourites} className="clear-btn">
            Clear All
          </button>
          {sortedFilteredFavourites.length === 0 ? (
            <p>No favourite students yet!</p>
          ) : (
            sortedFilteredFavourites.map((fav, index) => (
              <div key={index} className="favourite-item">
                <Link to={`/student/${fav}`} style={{ marginRight: '10px', color: '#4A2C2A' }}>
                  {fav}
                </Link>
                <button onClick={() => removeFromFavourites(fav)} className="remove-btn">
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Favourites;