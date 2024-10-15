require("dotenv").config();

const express = require("express");
const session = require("express-session");
const mysql = require("mysql2");
const cors = require("cors");

const fs = require("fs");
const https = require("https");
const crypto = require("crypto");
const MySQLStore = require("express-mysql-session")(session);

const { authenticateUser } = require("./utils");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the CORS middleware
// Configure CORS to allow requests from your frontend domain
app.use(cors({
	origin: 'https://stupendous-puppy-d6df50.netlify.app',
	methods: ['GET', 'POST'], // Include the methods used in your requests
	allowedHeaders: ['Content-Type', 'Authorization', 'api-key'],
	preflightContinue: false, // Allow preflight requests to pass through
	optionsSuccessStatus: 204 // Set the preflight success status to 204
}));


// IP address and port number on which application will run
const PORT = process.env.PORT || 3001;

const httpsServer = https.createServer(app);

// Database configuration
const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQL_ROOT_PASSWORD}@${process.env.RAILWAY_TCP_PROXY_DOMAIN}:${process.env.RAILWAY_TCP_PROXY_PORT}/${process.env.MYSQL_DATABASE}`;

// Create a MySQL connection
const connection = mysql.createConnection(urlDB);

connection.connect((connectionError) => {
	if (connectionError) {
		console.error("DATABASE CONNECTION: Unable to connect to the database:", connectionError);
		process.exit(1);
	}
	console.log("DATABASE CONNECTION: Connected to the database successfully.");
});

// Handle connection errors
connection.on("error", (connectionError) => {
	console.error("DATABASE CONNECTION: Connection error:", connectionError);
	if (connectionError.code === "PROTOCOL_CONNECTION_LOST") {
		// Reconnect if the connection is lost
		connection.connect((err) => {
			if (err) {
				console.error("DATABASE CONNECTION: Unable to reconnect to the database:", err);
				process.exit(1);
			}
			console.log("DATABASE CONNECTION: Reconnected to the database successfully.");
		});
	} else {
		throw connectionError;
	}
});

// Setup MySQL session store
const sessionStore = new MySQLStore({
		clearExpired: true,
		checkExpirationInterval: 1000 * 60 * 1, // 1 minute
		expiration: 1000 * 60 * 60 * 1, // 1 hour
		createDatabaseTable: true,
		schema: {
			tableName: "sessions",
			columnNames: {
				session_id: "session_id",
				expires: "expires",
				data: "data",
			},
		},
	},
	connection,
);

// Use express-session middleware with MySQL session store
app.use(
	session({
		secret: process.env.ACCESS_TOKEN,
		resave: true,
		saveUninitialized: true,
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 60 * 2, // 2 hours
			secure: true,
		},
	}),
);

// Middleware function authenticating API access
const apiMiddleware = (request, response, next) => {
	try {
		const apiKey = request.headers["api-key"];

		// Check if API key is present and valid
		if (apiKey && apiKey === process.env.API_KEY) {
			next();
		} else {
			response.status(401).send("API AUTH: Unauthorized - Invalid API Key");
		}
	} catch (error) {
		response.status(500).send("API AUTH: Internal Server Error");
	}
};

// Endpoint creation
const userRegisterEndpoint = "/userRegister";
const userLoginEndpoint = "/userLogin";
const verifyUserExistenceEndpoint = "/verifyUserExistence";
const userLogoutEndpoint = "/userLogout";

// Applying the API key middleware function
app.use(apiMiddleware);

// Creating an API endpoint where the API will add new user to the database
app.post(userRegisterEndpoint, (request, response) => {
	const name = request.body.name;
	const surname = request.body.surname;
	const email = request.body.email;
	const hashedPassword = request.body.password;

	connection.query("INSERT INTO user_data (name, surname, email, password) VALUES (?, ?, ?, ?)", [name, surname, email, hashedPassword], (err, res) => {
		if (err) {
			console.error("USER REGISTRATION: Internal Server Error" + err.message);
			response.status(500).send("Internal Server Error");
		} else {
			console.log("USER REGISTRATION: User created successfully");
			response.status(200).send("User created successfully");
		}
	});
});

// Creating an API endpoint for authentication of Login
app.get(userLoginEndpoint, (request, response) => {
	const email = request.query.param1;
	const password = request.query.param2;

	connection.query("SELECT * FROM user_data WHERE email = ?", [email], (err, results) => {
		if (err) {
			console.error("USER LOGIN: " + err);
			response.status(500).send("Internal Server Error");
		} else {
			// Definition of this function and functions which this function uses are located in utils.js
			authenticateUser(results, password, request, response);
		}
	});
});

// Creating an API endpoint to check if user with the provided email exists
app.post(verifyUserExistenceEndpoint, (request, response) => {
	const email = request.body.email;

	connection.query("SELECT * FROM user_data WHERE email = ?", [email], (err, results) => {
		if (err) {
			console.error("VERIFY USER: " + err);
			response.status(500).send("USER EXISTENCE: Internal Server Error");
		} else {
			if (results.length > 0) {
				// User Found with provided email
				console.log("VERIFY USER: User with provided email was found.");
				response.status(404).send("Email address already in use");
			} else {
				// No user found with the provided email
				console.log("VERIFY USER: No user with provided email found");
				response.status(200).send("No user found with the provided email");
			}
		}
	});
});

// Creating an API endpoint for user logout
app.get(userLogoutEndpoint, (request, response) => {
	// Check if session exists
	if (!request.session) {
		console.error("USER LOGOUT: Session doesn't exist");
		return response.status(400).send("USER LOGOUT: Bad Request: Session doesn't exist");
	} else {
		// Destroy session in session store
		sessionStore.destroy(request.session.id, (error) => {
			if (error) {
				console.error("USER LOGOUT: Error destroying session from session store", error);
				return response.status(500).send("USER LOGOUT: Internal Server Error");
			}

			// Destroy session
			request.session.destroy((err) => {
				if (err) {
					console.error("USER LOGOUT: Error destroying session", err);
					return response.status(500).send("USER LOGOUT: Internal Server Error");
				}
				console.log("USER LOGOUT: Logout Successful");
				response.status(200).send("Logout successful");
			});
		});
	}
});

httpsServer.listen(PORT, () => {
	console.log(`Server is running on https://localhost:${PORT}`);
});
