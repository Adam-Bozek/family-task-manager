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
                // FIXME: Nasledujúce riadky odstrániť pri hotovom backende
                setEmail(formData.email);
                setRole("after-reg");
                setIsLoggedIn(true);

                console.log("Registered:", formData);
                navigate("/AfterRegistration");
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
							<input
								className={styles.registrationFormInput}
								type="password"
								name="password"
								placeholder="Heslo"
								value={formData.password}
								onChange={handleChange}
								required
							/>
							<input
								className={styles.registrationFormInput}
								type="password"
								name="confirmPassword"
								placeholder="Zopakuj heslo"
								value={formData.confirmPassword}
								onChange={handleChange}
								required
							/>
							<button className={styles.registrationButton} type="submit">
								Zaregistrovať sa
							</button>
						</form>
						<p className={styles.registrationRegisterText}>
							Alebo sa <a href="/LogIn">prihláste.</a>
						</p>
					</div>
				</div>
			</div>
		</main>
	);
};

export default RegistrationPage;
