import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/LoginPage.module.css";

import { checkIfUserExists, logInUser } from "./utilities/Utils";
import { AppContext } from "./utilities/AppContext";

const LoginPage = () => {
	const { role, setEmail, isLoggedIn, setRole, setIsLoggedIn } = useContext(AppContext);

	const [email, setEmail1] = useState(null);
	const [password, setPassword] = useState(null);
	const [showPassword, setShowPassword] = useState(false); // Nový stav pre zobrazenie hesla

	const navigate = useNavigate();

	const handle_redirect = (route) => {
		navigate(route);
	};

	const handleUserLogin = async () => {
		if (!checkIfUserExists(email)) {
			alert("Neexistujúci používateľ!"); // Alert: User does not exist
			return;
		}

		try {
			const loginSuccess = await logInUser(email, password, setIsLoggedIn, setEmail, setRole);
			console.log("Login Success:", loginSuccess);
			if (!loginSuccess) {
				alert("Email alebo heslo sú zlé alebo nevyplnené")
			}
		} catch (error) {
			console.error("Login error:", error);
			alert("An error occurred during login.");
		}
	};

	// useEffect for role-based redirection
	useEffect(() => {
		if (isLoggedIn) {
			if (role === "after-reg") {
				handle_redirect("/AfterRegistration");
			} else if (role === "parent") {
				handle_redirect("/ParentDashboardTasks");
			} else if (role === "kid") {
				handle_redirect("/KidDashboard");
			}
		}
	}, [role, isLoggedIn]);

	return (
		<main className={styles.loginMain}>
			<div className={styles.loginContainer}>
				<div className={styles.loginLeftSide}>
					<h1 className={styles.loginWelcomeHeader}>Ste späť!</h1>
					<p className={styles.loginInfoText}>
						<p>Prihláste sa do svojho účtu.</p>{" "}
					</p>
				</div>
				<div className={styles.loginRightSide}>
					<h2 className={styles.loginTitle}>Prihláste sa</h2>

					<form className={styles.loginForm}>
						<input type="email" placeholder="Email" className={styles.loginFormInput} value={email} onChange={(e) => setEmail1(e.target.value)} />
						<div className={styles.passwordWrapper}>
							<input
								type={showPassword ? "text" : "password"} // Toggle the type based on state
								placeholder="Heslo"
								className={styles.loginFormInput}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type="button"
								className={styles.passwordToggleButton}
								onClick={() => setShowPassword(!showPassword)} // Toggle the state when clicked
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									className={`bi bi-eye${showPassword ? "-slash" : ""}`}
									viewBox="0 0 16 16">
									<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
									<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
								</svg>
								<span className="visually-hidden">Toggle password visibility</span>
							</button>
						</div>
						<button type="button" className={styles.loginButton} onClick={handleUserLogin}>
							Prihlásiť sa
						</button>
					</form>

					<p className={styles.loginRegisterText} onClick={() => handle_redirect("/Register")}>
						Alebo sa zaregistrujte.
					</p>
				</div>

				<div className="text-end mx-3">
					<i
						className={`bi bi-arrow-right-short ${styles.moreInfoIcon}`}
						onClick={() => handle_redirect("/Home")} // Use an arrow function to pass the argument
					></i>
				</div>
			</div>
		</main>
	);
};

export default LoginPage;
