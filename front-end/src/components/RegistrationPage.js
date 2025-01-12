import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/RegistrationPage.module.css"; // Import CSS file

import { AppContext } from "./utilities/AppContext";

import { validateName, validateSurname, validateEmail, validatePassword, validatePasswordMatch, createUserAccount } from "./utilities/Utils";

const RegistrationPage = () => {
	const { setEmail, setRole, setIsLoggedIn } = useContext(AppContext);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false); // Add state for password visibility

	const handle_redirect = (route) => {
		navigate(route);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Validácie
		if (!validateName(formData.firstName)) {
			alert("Nesprávne meno.");
			return;
		}

		if (!validateSurname(formData.lastName)) {
			alert("Nesprávne priezvisko.");
			return;
		}

		if (!validateEmail(formData.email)) {
			alert("Nesprávny email.");
			return;
		}

		// Validácia hesla
		const isPasswordValid = validatePassword(formData.password);
		if (!isPasswordValid) {
			const errorMessages = [];
			if (formData.password.length < 8) {
				errorMessages.push("Heslo musí obsahovať aspoň 8 znakov.");
			}
			if (!/[A-Z]/.test(formData.password)) {
				errorMessages.push("Heslo musí obsahovať aspoň jedno veľké písmeno.");
			}
			if (!/[a-z]/.test(formData.password)) {
				errorMessages.push("Heslo musí obsahovať aspoň jedno malé písmeno.");
			}
			if (!/\d/.test(formData.password)) {
				errorMessages.push("Heslo musí obsahovať aspoň jedno číslo.");
			}
			if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
				errorMessages.push("Heslo musí obsahovať aspoň jeden špeciálny znak.");
			}

			alert("Nesprávne heslo:\n" + errorMessages.join("\n"));
			return;
		}

		if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
			alert("Heslá sa nezhodujú.");
			return;
		}

		// Vytvorenie používateľského účtu
		createUserAccount(formData.firstName, formData.lastName, formData.email, formData.password)
			.then(() => {
				console.log("Registered:", formData);
				navigate("/Login");
			})
			.catch((error) => {
				console.error("Registration error:", error);
				alert("Nastala chyba pri registrácii.");
			});
	};

	return (
		<main className={styles.registrationMain}>
			<div className={styles.registrationContainer}>
				<div className={styles.registrationLeftSide}>
					<h1 className={styles.registrationWelcomeHeader}>Sme radi!</h1>
					<p className={styles.registrationInfoText}>Registrujte sa pre prístup k našim službám.</p>
				</div>
				<div className={styles.registrationRightSide}>
					<div className={styles.registrationForm}>
						<h2 className={styles.registrationLoginTitle}>Registrácia</h2>
						<form onSubmit={handleSubmit}>
							<input
								className={styles.registrationFormInput}
								type="text"
								name="firstName"
								placeholder="Meno"
								value={formData.firstName}
								onChange={handleChange}
								required
							/>
							<input
								className={styles.registrationFormInput}
								type="text"
								name="lastName"
								placeholder="Priezvisko"
								value={formData.lastName}
								onChange={handleChange}
								required
							/>
							<input
								className={styles.registrationFormInput}
								type="email"
								name="email"
								placeholder="Email"
								value={formData.email}
								onChange={handleChange}
								required
							/>

							<div className={styles.passwordWrapper}>
								<input
									className={styles.registrationFormInput}
									type={showPassword ? "text" : "password"}
									name="password"
									placeholder="Heslo"
									value={formData.password}
									onChange={handleChange}
									required
								/>
								<button type="button" className={styles.passwordToggleButton} onClick={() => setShowPassword(!showPassword)}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
										<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
										<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
									</svg>
								</button>
							</div>
							<div className={styles.passwordWrapper}>
								<input
									className={styles.registrationFormInput}
									type={showPassword ? "text" : "password"}
									name="confirmPassword"
									placeholder="Zopakuj heslo"
									value={formData.confirmPassword}
									onChange={handleChange}
									required
								/>
								<button type="button" className={styles.passwordToggleButton} onClick={() => setShowPassword(!showPassword)}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
										<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"></path>
										<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
									</svg>
								</button>
							</div>
							<button className={styles.registrationButton} type="submit">
								Zaregistrovať sa
							</button>
						</form>
						<p className={styles.registrationRegisterText}>
							Alebo sa <a href="/LogIn">prihláste.</a>
						</p>
					</div>
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

export default RegistrationPage;
