import React, { useState, useEffect } from 'react';
import './TeacherPage.css';
// import { useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton/LogoutButton";



function TeacherPage() {
  const [grades, setGrades] = useState([]);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState('');
  

  useEffect(() => {
    fetch('/api/grades')
      .then(res => res.json())
      .then(data => setGrades(data));
  }, []);

  const addGrade = async () => {
    if (!name || !grade) return alert('Enter both name and grade.');

    const response = await fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, grade: parseFloat(grade) })
    });

    if (response.ok) {
      setGrades([...grades, { name, grade }]);
      setName('');
      setGrade('');
    } else {
      alert('Failed to add grade.');
    }
  };

  const editGrade = async (nameToEdit) => {
    const newGrade = prompt(`Enter new grade for ${nameToEdit}`);
    if (newGrade === null) return;

    const response = await fetch(`/api/grades/${nameToEdit}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade: parseFloat(newGrade) })
    });

    if (response.ok) {
      setGrades(grades.map(g => g.name === nameToEdit ? { ...g, grade: newGrade } : g));
    }
  };

  const deleteGrade = async (nameToDelete) => {
    if (!window.confirm(`Delete ${nameToDelete}'s grade?`)) return;

    const response = await fetch(`/api/grades/${nameToDelete}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setGrades(grades.filter(g => g.name !== nameToDelete));
    }
  };

  const searchGrade = async () => {
    const response = await fetch(`/api/grades/${searchName}`);
    if (response.status === 404) {
      setSearchResult('Student not found.');
    } else {
      const data = await response.json();
      setSearchResult(`${searchName}'s grade is ${data.grade}`);
    }
  };
  

  return (
    <div className="container">
      <h1>Students</h1>
      <div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Student Name" />
        <input value={grade} onChange={e => setGrade(e.target.value)} placeholder="Grade" type="number" />
        <button className="add" onClick={addGrade}>Add Grade</button>
      </div>
      <h3>Search Grade by Name</h3>
      <input value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="Student Name" />
      <button onClick={searchGrade}>Search</button>
      <p id="searchResult">{searchResult}</p>
      <table>
        <thead>
          <tr><th>Name</th><th>Grade</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {grades.map(g => (
            <tr key={g.name}>
              <td>{g.name}</td>
              <td>{g.grade}</td>
              <td>
                <button className="edit" onClick={() => editGrade(g.name)}>Edit</button>
                <button className="delete" onClick={() => deleteGrade(g.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
        <LogoutButton />
    </div>
  );
}

export default TeacherPage;
