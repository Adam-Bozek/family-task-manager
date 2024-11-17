// Import necessary modules from React and other libraries
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/AfterRegistrationPage.module.css"; // Import CSS module for styling

import { addToFamily, familyCreation } from "./utilities/Utils"; // Import utility functions
import { AppContext } from "./utilities/AppContext"; // Import application context

// Component for the page after registration
const AfterRegistration = () => {
	// Define state variables for family name and family code
	const [familyName, setFamilyName] = useState(""); // Tracks input for family name
	const [familyCode, setFamilyCode] = useState(""); // Tracks input for family code

	// Destructure `email` and `setRole` from AppContext
	const { email, setRole } = useContext(AppContext);

	const navigate = useNavigate(); // Hook to navigate between pages

	// Function to handle creation of a new family
	const handleFamilyCreation = () => {
		if (familyCreation(familyName, email)) {
			// Calls familyCreation utility with familyName and email
			setRole("parent"); // Sets the user's role to 'parent'
			navigate("/ParentDashboardTasks"); // Redirects to the Parent Dashboard
		}
	};

	// Function to handle joining an existing family
	const handleJoinFamily = async () => {
		try {
			// Call addToFamily utility function and wait for the result
			const result = await addToFamily(familyCode, email);

			// Check if joining was successful based on result's success status
			if (result.success) {
				// Check the role from the result and set the user role accordingly
				if (result.role) {
					if (result.role === "parent") {
						setRole("parent"); // If the role is 'parent', set it and navigate to the parent dashboard
						navigate("/ParentDashboardTasks");
					} else if (result.role === "kid") {
						setRole("kid"); // If the role is 'kid', set it and navigate to an additional information page
						navigate("/MoreInfo");
					}
				} else {
					console.log("No role returned."); // Logs a message if no role was returned
				}
			} else {
				console.log("Failed to add to family:", result.message); // Logs error message if joining fails
				alert(result.message || "Failed to join family. Please try again."); // Alert with an error message
			}
		} catch (error) {
			console.error("Error in handleJoinFamily:", error); // Logs any unexpected errors
			alert("An unexpected error occurred. Please try again."); // Alert for unexpected errors
		}
	};

	return (
		// Main container for the page
		<div className={styles.afterRegistrationContainer}>
			<div className={styles.blurredBannerContainer}>
				<h1 className={styles.title}>A je to!</h1>
				<p className={styles.description}>Ste prihlásený, ale prvým krokom je vytvorenie si rodiny alebo prihlásenie sa do už existujúcej</p>

				{/* Form for joining or creating a family */}
				<div className={styles.formContainer}>
					{/* Section for joining an existing family */}
					<div className={styles.joinFamilySection}>
						<p className={styles.instructions}>Ak už máte kľúč na pridanie sa do rodiny tak ho zadajte sem.</p>
						<input
							type="text"
							placeholder="Kód"
							value={familyCode}
							onChange={(e) => setFamilyCode(e.target.value)} // Update familyCode state on input change
							className={styles.inputField}
						/>
						<button className={styles.actionButton} onClick={handleJoinFamily}>
							Pridať sa k rodine
						</button>
					</div>

					{/* Section for creating a new family */}
					<div className={styles.createFamilySection}>
						<p className={styles.instructions}>Ak nemáte ešte rodinu tak si ju vytvorte.</p>
						<input
							type="text"
							placeholder="Názov rodiny"
							value={familyName}
							onChange={(e) => setFamilyName(e.target.value)} // Update familyName state on input change
							className={styles.inputField}
						/>
						<button className={styles.actionButton} onClick={handleFamilyCreation}>
							Vytvoriť rodinu
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AfterRegistration;
