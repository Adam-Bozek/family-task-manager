import Axios from "axios";

const apiAddress = "http://147.232.205.117:5000/api";

// Functions for user "kid"
export async function getPoints(email) {
	try {
		const formData = new FormData();
		formData.append("email", email);

		const localApiAddress = apiAddress + "/Kids_dashboard";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			const data = response.data;

			// Handle malformed response formats
			let tasks = [];
			let tasksToChooseFrom = [];
			let rewards = [];
			let credits = 0;

			// Parse `return` field
			if (data.return) {
				try {
					tasks = JSON.parse(data.return.replace(/'/g, '"')); // Replace single quotes with double quotes for JSON
				} catch (err) {
					console.error("Error parsing tasks:", err);
				}
			}
			// Parse `return1` field (rewards)
			if (data.return1) {
				try {
					// Step 1: Replace single quotes with double quotes
					const correctedData = data.return1.replace(/'/g, '"');

					// Step 2: Replace parentheses with square brackets for valid arrays
					const formattedData = correctedData.replace(/\((.*?)\)/g, "[$1]");

					// Step 3: Parse the corrected JSON string
					const rawRewards = JSON.parse(formattedData);

					// Step 4: Map the rewards into objects with `name` and `status`
					rewards = rawRewards.map(([name, status]) => ({
						name,
						status: status === "true", // Convert string to boolean
					}));
				} catch (err) {
					console.error("Error parsing rewards:", err);
				}
			}

			// Parse `return2` field (credits)
			if (data.return2) {
				try {
					const rawCredits = eval(data.return2); // Eval to handle tuples (risky, but needed here)
					credits = parseFloat(rawCredits[0]) || 0;
				} catch (err) {
					console.error("Error parsing credits:", err);
				}
			}

			if (data.return3) {
				try {
					// Replace single quotes with double quotes for valid JSON
					const correctedReturn3 = data.return3.replace(/'/g, '"');
					tasksToChooseFrom = JSON.parse(correctedReturn3);
				} catch (err) {
					console.error("Error parsing tasks_to_choose_from:", err);
				}
			}

			console.log("Tasks to choose from:", tasksToChooseFrom);
			console.log("Tasks:", tasks);
			console.log("Rewards:", rewards);

			return { tasks, tasksToChooseFrom, rewards, credits };
		}
	} catch (err) {
		console.error("Error fetching points:", err);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			console.error("Network error. Please check your connection and try again.");
		} else {
			console.error("An unexpected error occurred. Please try again.");
		}
		return {};
	}
}

export async function getTasks() {}

export async function getCompletedTasks() {}

export async function getAvailableRewards() {}

export async function markTaskComplete(reward_id) {
	try {
		const formData = new FormData();
		formData.append("id", reward_id);

		const localApiAddress = apiAddress + "/Kids_confirm";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			return true;
		} else {
			console.error("User task was not confirmed.");
			return false;
		}
	} catch (err) {
		console.error("Error creating reward:", err);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			console.error("Network error. Please check your connection and try again.");
		} else {
			console.error("An unexpected error occurred. Please try again.");
		}
		return false;
	}
}

export async function markTaskMine(email, task_id) {
	try {
		const formData = new FormData();
		formData.append("id", task_id);
		formData.append("email", email);

		const localApiAddress = apiAddress + "/Kids_task";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			return true;
		} else {
			console.error("User task was not confirmed.");
			return false;
		}
	} catch (err) {
		console.error("Error creating reward:", err);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			console.error("Network error. Please check your connection and try again.");
		} else {
			console.error("An unexpected error occurred. Please try again.");
		}
		return false;
	}
}

export async function exchangePointsForRewards() {}

export async function getRewards(email) {
	try {
		const formData = new FormData();
		formData.append("email", email);

		const localApiAddress = apiAddress + "/Wallet";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			// Extract remaining credits and rewards from the response
			const remainingCredits = parseFloat(response.data.return.replace(/[\[\]]/g, "")); // Parse remaining credits
			const rewardsArray = JSON.parse(
				response.data.return1
					.replace(/'/g, '"') // Replace single quotes with double quotes
					.replace(/\((.*?)\)/g, "[$1]"), // Replace parentheses with brackets
			);

			// Map the rewards into objects with `id`, `name`, and `price`
			const rewards = rewardsArray.map(([id, name, price]) => ({
				id,
				name,
				price,
			}));

			return { remainingCredits, rewards }; // Return both remaining credits and rewards
		} else {
			console.error("Failed to fetch rewards.");
			return { remainingCredits: 0, rewards: [] };
		}
	} catch (err) {
		console.error("Error fetching rewards:", err);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			console.error("Network error. Please check your connection and try again.");
		} else {
			console.error("An unexpected error occurred. Please try again.");
		}
		return { remainingCredits: 0, rewards: [] };
	}
}

export async function getExchangedRewards(email, id, difference) {
	try {
		const formData = new FormData();
		formData.append("email", email);
		formData.append("id", id);
		formData.append("difference", difference);

		const localApiAddress = apiAddress + "/Kids_exchange";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			// Extract remaining credits and rewards from the response
			const remainingCredits = parseFloat(response.data.return.replace(/[\[\]]/g, "")); // Parse remaining credits
			const rewardsArray = JSON.parse(
				response.data.return1
					.replace(/'/g, '"') // Replace single quotes with double quotes
					.replace(/\((.*?)\)/g, "[$1]"), // Replace parentheses with brackets
			);

			// Map the rewards into objects with `id`, `name`, and `price`
			const rewards = rewardsArray.map(([id, name, price]) => ({
				id,
				name,
				price,
			}));

			return { remainingCredits, rewards }; // Return both remaining credits and rewards
		} else {
			console.error("Failed to fetch rewards.");
			return { remainingCredits: 0, rewards: [] };
		}
	} catch (err) {
		console.error("Error fetching rewards:", err);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			console.error("Network error. Please check your connection and try again.");
		} else {
			console.error("An unexpected error occurred. Please try again.");
		}
		return { remainingCredits: 0, rewards: [] };
	}
}
