import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/RegistrationPage.module.css"; // Import CSS file

import { AppContext } from "./utilities/AppContext";

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
		// FIXME: TOTO JE IBA PRISTUP NA DALSIE STRANKY BEZ BACK-ENDU
    // FIXME: NASLEDUJUCE 3 RIADKY JE POTREBNE VYMAZAT KED BUDE BACKEND HOTOVY
		setEmail(formData.email);
		setRole("after-reg");
		setIsLoggedIn(true);

		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			alert("Heslá sa nezhodujú");
			return;
		}
		console.log("Registered:", formData);

		navigate("/AfterRegistration"); // Po registrácii ťa presmeruje
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
                            <input className={styles.registrationFormInput} type="text" name="firstName" placeholder="Meno" value={formData.firstName} onChange={handleChange} required />
                            <input className={styles.registrationFormInput} type="text" name="lastName" placeholder="Priezvisko" value={formData.lastName} onChange={handleChange} required />
                            <input className={styles.registrationFormInput} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <input className={styles.registrationFormInput} type="password" name="password" placeholder="Heslo" value={formData.password} onChange={handleChange} required />
                            <input className={styles.registrationFormInput} type="password" name="confirmPassword" placeholder="Zopakuj heslo" value={formData.confirmPassword} onChange={handleChange} required />
                            <button className={styles.registrationButton} type="submit">Zaregistrovať sa</button>
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
