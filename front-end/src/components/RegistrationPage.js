import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/RegistrationPage.css'; // Import CSS file

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Heslá sa nezhodujú");
      return;
    }
    console.log("Registered:", formData);
    navigate('/AfterRegistration');  // Po registrácii ťa presmeruje
  };

  return (
    <main>
      <div className="login-container">
        <div className="left-side">
          <h1 className="welcome-header">Sme radi!</h1>
          <p className="info-text">Registrujte sa pre prístup k našim službám.</p>
        </div>
        <div className="right-side">
          <div className="login-form">
            <h2 className="login-title">Registrácia</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="form-input"
                type="text"
                name="firstName"
                placeholder="Meno"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                className="form-input"
                type="text"
                name="lastName"
                placeholder="Priezvisko"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Heslo"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                className="form-input"
                type="password"
                name="confirmPassword"
                placeholder="Zopakuj heslo"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="submit">Zaregistrovať sa</button>
            </form>
            <p className="register-text">Alebo sa <a href="/LogIn">prihláste.</a></p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegistrationPage;
