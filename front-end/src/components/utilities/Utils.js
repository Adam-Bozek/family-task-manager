import bcrypt from "bcryptjs";
import Axios from "axios";

// Functions for creating a user
export function validateName(name) {
	if (typeof name !== "string" || !name.trim()) {
		return false;
	}

	return true;
}

export function validateSurname(surname) {
	if (typeof surname !== "string" || !surname.trim()) {
		return false;
	}

	return true;
}

export function validateEmail(email) {
	const emailRegex = /^[a-zA-Z0-9](.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*.[a-zA-Z]{2,6}$/;
	return emailRegex.test(email);
}

export function validatePassword(password) {
	const minLength = 8;
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

	// Ensure password meets all conditions
	return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

export function validatePasswordMatch(password, confirmPassword) {
	return password === confirmPassword;
}

export async function createUserAccount(name, surname, email, password) {
	// Basic input validation before proceeding
	if (!name || !surname || !email || !password) {
		console.error("Please fill out all fields.");
		return;
	}

	try {
		// Hash the password with bcryptjs before sending it to the backend
		const hashedPassword = await bcrypt.hash(password, 10);

		// Defining payload
		const payload = {
			name: name,
			surname: surname,
			email: email,
			password: hashedPassword,
		};

		// Send user details with the hashed password to the backend
		const response = await Axios.post(apiAddress, payload, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		return true;
	} catch (err) {
		// Enhanced error handling
		console.error("Error creating account:", err);

		// Handle specific Axios errors (e.g., network issues, validation issues)
		if (err.response) {
			// Server responded with a status other than 2xx
			alert(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
			return false;
		} else if (err.request) {
			// Request was made but no response was received (network error)
			alert("Network error. Please check your connection and try again.");
			return false;
		} else {
			// Something else happened
			alert("An unexpected error occurred. Please try again.");
			return false;
		}
	}
}

export async function checkUserExists(email) {
	// Basic input validation before proceeding
	if (!email) {
		console.error("Please fill out all fields.");
		return;
	}

	try {
		// Defining payload
		const payload = {
			email: email,
		};

		// Send user details with the hashed password to the backend
		const response = await Axios.post(apiAddress, payload, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		return true;
	} catch (err) {
		// Enhanced error handling
		console.error("Error verifying user", err);

		// Handle specific Axios errors (e.g., network issues, validation issues)
		if (err.response) {
			// Server responded with a status other than 2xx
			alert(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
			return false;
		} else if (err.request) {
			// Request was made but no response was received (network error)
			alert("Network error. Please check your connection and try again.");
			return false;
		} else {
			// Something else happened
			alert("An unexpected error occurred. Please try again.");
			return false;
		}
	}
}

export async function logInUser(email, password) {
	// Basic input validation before proceeding
	if (!email || !password) {
		console.error("Please fill out all fields.");
		return;
	}

	try {
		// Defining payload
		const payload = {
			email: email,
			password: hashedPassword,
		};

		// Send user details with the hashed password to the backend
		const response = await Axios.post(apiAddress, payload, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		return true;
	} catch (err) {
		// Enhanced error handling
		console.error("Error loginning in:", err);

		// Handle specific Axios errors (e.g., network issues, validation issues)
		if (err.response) {
			// Server responded with a status other than 2xx
			alert(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
			return false;
		} else if (err.request) {
			// Request was made but no response was received (network error)
			alert("Network error. Please check your connection and try again.");
			return false;
		} else {
			// Something else happened
			alert("An unexpected error occurred. Please try again.");
			return false;
		}
	}
}

export async function logOutUser(setIsLoggedIn, setEmail, setRole) {
	try {
		// Call the setter functions to reset login state in context
		setIsLoggedIn(false);
		setEmail("");
		setRole(null);

		return true;
	} catch (error) {
		console.error("Error logging out:", error);
		return false;
	}
}
