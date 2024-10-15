const bcrypt = require("bcryptjs");

// Function to authenticate user after retrieving user data from the database
const authenticateUser = (results, password, request, response) => {
	if (results.length > 0) {
		const storedHashedPassword = results[0].password;

		bcrypt.compare(password, storedHashedPassword, (bcryptErr, bcryptResult) => {
			if (bcryptErr) {
				console.error("USER LOGIN: " + bcryptErr);
				response.status(500).send("Internal Server Error");
			} else {
				handleAuthenticationResult(bcryptResult, request, response, results[0].email);
			}
		});
	} else {
		console.log("USER LOGIN: Unauthorized: Invalid user");
		response.status(401).send("Unauthorized: Invalid email or password");
	}
};

// Function to handle the result of user authentication
const handleAuthenticationResult = (bcryptResult, request, response, userEmail) => {
	if (bcryptResult) {
		regenerateSession(request, response, userEmail);
	} else {
		response.status(401).send("Unauthorized: Invalid email or password");
		console.log("USER LOGIN: Unauthorized: Invalid password");
	}
};

// Function to regenerate session after successful authentication
const regenerateSession = (request, response, userEmail) => {
	request.session.regenerate((sessionErr) => {
		if (sessionErr) {
			console.error("USER LOGIN: " + sessionErr);
			response.status(500).send("Internal Server Error");
		} else {
			storeUserDataInSession(request, response, userEmail);
		}
	});
};

const storeUserDataInSession = (request, response, userEmail) => {
	request.session.user = userEmail;

	request.session.save((saveErr) => {
		if (saveErr) {
			console.log("USER LOGIN: " + saveErr);
			response.status(500).send("Internal Server Error");
		} else {
			console.log("USER LOGIN: Authentication successful");
			response.status(200).send("Authentication successful");
		}
	});
};

module.exports = {
	authenticateUser,
};
