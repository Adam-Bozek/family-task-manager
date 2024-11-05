import bcrypt from "bcryptjs";
import Axios from "axios";

const apiAddress = "http://147.232.205.117:5000";

// Functions for creating a user
export function validateName(name) {
	// Check if name is a string, not empty, and contains only alphabetic characters (with diacritics) and spaces
	if (typeof name !== "string" || !name.trim() || !/^[\p{L}\s]+$/u.test(name)) {
		return false;
	}

	return true;
}

export function validateSurname(surname) {
	// Check if surname is a string, not empty, and contains only alphabetic characters (with diacritics) and spaces
	if (typeof surname !== "string" || !surname.trim() || !/^[\p{L}\s]+$/u.test(surname)) {
		return false;
	}

	return true;
}


export function validateEmail(email) {
	// Improved regex for email validation
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (typeof email !== "string" || !emailRegex.test(email.trim())) {
		return false;
	}
	return true;
}

export function validatePassword(password) {
	if (typeof password !== "string") {
		return false;
	}

	const minLength = 8;
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

	// Ensure password meets all conditions
	return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

export function validatePasswordMatch(password, confirmPassword) {
	// Ensure both passwords match
	if (typeof password !== "string" || typeof confirmPassword !== "string") {
		return false;
	}
	return password === confirmPassword;
}

export async function createUserAccount(name, surname, email, password) {
	// Validate inputs
	if (!validateName(name)) {
		console.error("Invalid name. Please enter a valid name.");
		return;
	}
	if (!validateSurname(surname)) {
		console.error("Invalid surname. Please enter a valid surname.");
		return;
	}
	if (!validateEmail(email)) {
		console.error("Invalid email. Please enter a valid email address.");
		return;
	}
	if (!validatePassword(password)) {
		console.error("Invalid password. Password must be at least 8 characters, with uppercase, lowercase, number, and special character.");
		return;
	}

	try {
		// Hash the password with bcryptjs before sending it to the backend
		const hashedPassword = await bcrypt.hash(password, 10);
	
		// Using FormData to send form-urlencoded data as the backend expects request.form
		const formData = new FormData();
		formData.append("name", name);
		formData.append("surname", surname);
		formData.append("email", email);
		formData.append("password", hashedPassword);
	
		// Updated to use the correct endpoint URL
		const localApiAddress = apiAddress + "/Create_user";
	
		// Send the form data to the backend endpoint for user creation
		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	
		// Check response status for success confirmation
		if (response.status === 201) {
			alert("User successfully created.");
			return true;
		} else {
			alert("User creation was unsuccessful.");
			return false;
		}
	} catch (err) {
		// Enhanced error handling
		console.error("Error creating account:", err);
	
		if (err.response) {
			alert(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
			return false;
		} else if (err.request) {
			alert("Network error. Please check your connection and try again.");
			return false;
		} else {
			alert("An unexpected error occurred. Please try again.");
			return false;
		}
	}
	
}

// Functions for logging in a user
export async function checkIfUserExists(email) {
	// Validate email
	if (!validateEmail(email)) {
		console.error("Invalid email. Please enter a valid email address.");
		return;
	}

	try {
		// Using FormData to send form-urlencoded data as the backend expects request.form
		const formData = new FormData();
		formData.append("email", email);

		const localApiAddress = apiAddress + "/Check_user_exist";

		// Send the form data to the backend endpoint to check if the user exists
		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return true;
	} catch (err) {
		// Enhanced error handling
		console.error("Error verifying user:", err);

		if (err.response) {
			alert(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
			return false;
		} else if (err.request) {
			alert("Network error. Please check your connection and try again.");
			return false;
		} else {
			alert("An unexpected error occurred. Please try again.");
			return false;
		}
	}
}

export async function logInUser(email, password, setIsLoggedIn, setEmail, setRole) {
	// Validate inputs
	if (!validateEmail(email)) {
		console.error("Invalid email. Please enter a valid email address.");
		return;
	}
	if (!validatePassword(password)) {
		console.error("Invalid password. Password must be at least 8 characters, with uppercase, lowercase, number, and special character.");
		return;
	}

	try {
		// Using FormData to send form-urlencoded data as the backend expects request.form
		const formData = new FormData();
		formData.append("email", email);
		formData.append("password", password);

		const localApiAddress = apiAddress + "/Login";

		// Send the form data to the backend endpoint for login
		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		// Extract role from the response
		const { message, role } = response.data;

		if (response.status === 202) {
			console.log(message);
			if (role) {
				setEmail(email);
				setRole(role);
				setIsLoggedIn(true);
			}
			return true;
		} else {
			console.error("Unexpected status code:", response.status);
			return false;
		}
	} catch (err) {
		// Enhanced error handling
		console.error("Error logging in:", err);

		if (err.response) {
			alert(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
			return false;
		} else if (err.request) {
			alert("Network error. Please check your connection and try again.");
			return false;
		} else {
			alert("An unexpected error occurred. Please try again.");
			return false;
		}
	}
}

export function logOutUser(setIsLoggedIn, setEmail, setRole) {
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
