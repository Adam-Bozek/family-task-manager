import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/LoginPage.css";

import { checkIfUserExists, logInUser } from "./utilities/Utils";

const LoginPage = () => {
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);

	const navigate = useNavigate();

	const handle_redirect = (route) => {
		navigate(route);
	};

	const const_handle_user_login = () => {
    if (!checkIfUserExists(email)) {
      alert("Neexistujuci používateľ!");
    }
  };

	return (
		<main>
			<div className="login-container">
				<div className="left-side">
					<h1 className="welcome-header">Ste späť!</h1>
					<p className="info-text">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mollis facilisis mauris, nec sollicitudin quam congue vitae.
					</p>
				</div>
				<div className="right-side">
					<h2 className="login-title">Prihláste sa</h2>
					<form className="login-form">
						<input type="email" placeholder="Email" className="form-input" />
						<input type="password" placeholder="Heslo" className="form-input" />
						<button type="button" className="btn btn-primary btn-dark" onClick={() => handle_redirect("/LogIn")}>
							Prihlásiť sa
						</button>
					</form>
					<p className="register-text" onClick={() => handle_redirect("/Register")}>
						Alebo sa zaregistrujte.
					</p>
				</div>
			</div>
		</main>
	);
};

export default LoginPage;
