import React, { useState } from "react";
import axios from "axios";

import "./App.css";
import bgImage from "./assets/pp1.png";







function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    department: "",
  });

  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile number: allow only digits and max 10 digits
    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setForm({ ...form, mobile: numericValue });
      }
      return;
    }
    
    

    
    
    // Age: allow only values between 1 and 120
    if (name === "age") {
      if (value === "" || (Number(value) >= 1 && Number(value) <= 120)) {
        setForm({ ...form, age: value });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    // Frontend validations
    if (!form.name.trim()) {
      alert("Please enter patient name");
      return;
    }

    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120) {
      alert("Age must be between 1 and 120");
      return;
    }

    if (form.mobile.length !== 10) {
      alert("Mobile number must be exactly 10 digits");
      return;
    }

    if (!form.department) {
      alert("Please select a department");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/patients",
        form
      );

      setToken(response.data.token);
      setMessage("Patient registered successfully!");

      // Clear form after success
      setForm({
        name: "",
        age: "",
        gender: "",
        mobile: "",
        address: "",
        department: "",
      });
    } catch (error) {
      console.error(error);

      if (error.response?.data?.detail) {
        alert(JSON.stringify(error.response.data.detail));
      } else {
        alert("Failed to register patient");
      }
    }
  };

  return (
    <div className="container">
      <h2>Patient Registration</h2>

      <form onSubmit={submitForm}>
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
<br />

        <div>
          <label>Age (1 - 120)</label>
          <br />
          <input
            type="number"
            name="age"
            min="1"
            max="120"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Gender</label>
          <br />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <br />

        <div>
          <label>Mobile Number</label>
          <br />
          <input
            type="text"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            maxLength={10}
            placeholder="10 digit mobile number"
            required
          />
        </div>

        <br />

        <div>
          <label>Address</label>
          <br />
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Department</label>
          <br />
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>
        </div>

        <br />

        <button type="submit">Register Patient</button>
      </form>

      {message && (
        <div className="success">
          <p>{message}</p>
        </div>
      )}

      {token && (
        <div className="token-box">
          <h3>Generated Token</h3>
          <p>
            <strong>{token}</strong>
          </p>
        </div>
      )}
      

<div
  style={{
    minHeight: "90vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }}
></div>
      
    </div>
  );
}

export default App;
















