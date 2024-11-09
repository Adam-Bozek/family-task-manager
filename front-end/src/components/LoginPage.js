import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/LoginPage.module.css"; 

import { checkIfUserExists, logInUser } from "./utilities/Utils";

import {AppContext} from "./utilities/AppContext";

const LoginPage = () => {
	const { role, setEmail, isLoggedIn, setRole, setIsLoggedIn } = useContext(AppContext);

	const [email, setEmail1] = useState(null);
	const [password, setPassword] = useState(null);

	const navigate = useNavigate();

	const handle_redirect = (route) => {
		navigate(route);
	};

	const handleUserLogin = async () => {
    if (!checkIfUserExists(email)) {
      alert("Neexistujuci používateľ!"); // Alert: User does not exist
      return;
    }

    try {
      const loginSuccess = await logInUser(email, password, setIsLoggedIn, setEmail, setRole);
      console.log("Login Success:", loginSuccess);
      if (!loginSuccess) {
        alert("Email alebo heslo je zle."); // Alert: Email or password is wrong
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
  }, [role, isLoggedIn]);;

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
							onChange={(e) => setEmail1(e.target.value)} 
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
							onClick={handleUserLogin} 
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
