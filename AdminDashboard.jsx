import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/patients")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Mobile</th>
            <th>Department</th>
            <th>Token</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.mobile}</td>
              <td>{patient.department}</td>
              <td>{patient.token}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;