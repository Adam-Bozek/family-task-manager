import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/LoginPage.module.css"; 

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
		} else {
			if (logInUser(email, password)) {
				handle_redirect("/Dashboard");
			} else {
				alert("Email alebo heslo je zle.");
			}
		}
	};

	return (
		<main className={styles.loginMain}>
			<div className={styles.loginContainer}>

				<div className={styles.loginLeftSide}>
					<h1 className={styles.loginWelcomeHeader}>Ste späť!</h1>
					<p className={styles.loginInfoText}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mollis facilisis mauris, nec sollicitudin quam congue vitae.
					</p>
				</div>
				<div className={styles.loginRightSide}>

					<h2 className={styles.loginTitle}>Prihláste sa</h2>

					<form className={styles.loginForm}>
						<input
							type="email"
							placeholder="Email"
							className={styles.loginFormInput}
							value={email}
							onChange={(e) => setEmail(e.target.value)} 
						/>
						<input
							type="password"
							placeholder="Heslo"
							className={styles.loginFormInput}
							value={password}
							onChange={(e) => setPassword(e.target.value)} 
						/>
						<button
							type="button"
							className={styles.loginButton}
							onClick={const_handle_user_login} 
						>
							Prihlásiť sa
						</button>
					</form>

					<p
						className={styles.loginRegisterText}
						onClick={() => handle_redirect("/Register")}
					>
						Alebo sa zaregistrujte.
					</p>

      
				</div>

        <div className="text-end mx-3">
						<i
							className="bi bi-arrow-right-short" // Use className here
							onClick={() => handle_redirect("/Home")} // Use an arrow function to pass the argument
						></i>
					</div>

			</div>
		</main>
	);
};

export default LoginPage;
