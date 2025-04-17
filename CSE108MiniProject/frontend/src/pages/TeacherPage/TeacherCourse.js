import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams from react-router-dom
import axios from 'axios';

const TeacherCourse = () => {
  const { courseId } = useParams();  // Access courseId from URL params

  console.log(courseId);  // Check if courseId is correctly logged
  
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoster = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get(`/api/teacher/courses/${courseId}/roster`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoster(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching roster:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchRoster();  // Fetch roster when courseId is available
  }, [courseId]);  // This will trigger when courseId changes

  return (
    <div>
      <h1>Course Roster</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((student) => (
              <tr key={student.id}>
                <td>{`${student.firstName} ${student.lastName}`}</td>
                <td>{student.grade || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherCourse;
