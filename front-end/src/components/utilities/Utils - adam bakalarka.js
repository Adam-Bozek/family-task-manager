import bcrypt from "bcryptjs";
import Axios from "axios";


const apiKey = process.env.REACT_APP_API_KEY;

export const webProtocol = "https";
export const apiIPAddress = "bachelors-thesis-app-production.up.railway.app";

export const year = new Date().getFullYear();

/** TODO LIST
 *  TODO: handle wrong function input properties
 *  TODO: @param functions inputs
 *  TODO: Make password functions recognize that password is incorrect
 */

// This bool function checks if the name was inputted
// On success function will return TRUE
export function checkName(name) {
	if (name === "") {
		return false;
	}
	return true;
}

// This bool function checks if the name was inputted
// On success function will return TRUE
export function checkSurname(surname) {
	if (surname === "") {
		return false;
	}
	return true;
}

// This bool function checks if the email was inputted correctly using regex
// On success function will return TRUE
export function checkEmail(email) {
	const emailRegex = /^[a-zA-Z0-9](.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*.[a-zA-Z]{2,6}$/;
	return emailRegex.test(email);
}

// This bool function checks if the password was inputted
// On success function will return TRUE
export function checkPassword(password) {
	return password !== "";
}

// This bool function checks if the passwords input are not empty and if they are equal
// On success function will return TRUE
export function checkPasswords(password, passwordRepeat) {
	return password !== "" && passwordRepeat !== "" && password === passwordRepeat;
}

// This bool function checks if the User credentials are not empty and if they are equal
// On success function will return TRUE
export async function verifyUserLogin(email, password, apiAddress) {
	try {
		const response = await fetch(`${apiAddress}?param1=${email}&param2=${password}`, {
			credentials: "include",
			method: "GET",
			headers: {
				"api-key": apiKey,
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return true;
	} catch (error) {
		console.error("There was a problem with the fetch operation:", error);
		return false;
	}
}

// This bool function checks if the email is already regis
// On success function will return TRUE
export async function verifyUserExistence(email, apiAddress) {
	try {
		const response = await fetch(apiAddress, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"api-key": apiKey,
			},
			body: JSON.stringify({
				email: email,
			}),
		});

		if (response.ok) {
			// No user found with provided email address
			return true;
		} else {
			// User found with provided email address
			return false;
		}
	} catch (error) {
		console.error("Error during authentication: " + error);
		return false;
	}
}

// This function will post to database
// This is function without return
export async function createUser(name, surname, email, password, apiAddress, navigate) {
	try {
		const response = await Axios.post(
			apiAddress,
			{
				name: name,
				surname: surname,
				email: email,
				password: password,
			},
			{
				headers: {
					"api-key": apiKey,
					"Content-Type": "application/json",
				},
			},
		);

		// Successful registration response
		alert(response.data + ". Please log in.");
		navigate("/Login");
	} catch (err) {
		// Error handling for registration failure
		alert(err);
	}
}

// This function hashes passwords
// Return is hashed string
const saltRounds = 10;
export async function hashPassword(password) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, saltRounds, function (err, hash) {
			if (err) {
				reject(hash);
			} else {
				resolve(hash);
			}
		});
	});
}

// This function logs out User from and application
export async function logoutUser(apiAddress, navigate) {
	try {
		const response = await fetch(apiAddress, {
			method: "GET",
			headers: {
				"api-key": apiKey,
			},
		});

		if (!response.ok) {
			throw new Error("Logout failed");
		}
		// Perform any additional actions after successful logout (e.g., redirect to login page)
		navigate("/Home");
	} catch (error) {
		console.error("Logout error:", error.message);
		// Handle error (e.g., display error message to the user)
		alert(error.message);
	}
}
