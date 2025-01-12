import Axios from "axios";

const apiAddress = "http://147.232.205.117:5000/api";

export async function getFamilyData(email) {
	try {
		const formData = new FormData();
		formData.append("email", email);

		const localApiAddress = apiAddress + "/Hash";
		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			const { return: keysString, return2: membersString } = response.data;

			if (!keysString || !membersString) {
				console.error("Error: Missing keysString or membersString in response");
				return { keys: [], members: [] };
			}

			let keysArray = [];
			let membersArray = [];

			try {
				const cleanedKeysString = keysString.replace(/\(/g, "[").replace(/\)/g, "]").replace(/'/g, '"');
				keysArray = JSON.parse(cleanedKeysString);
			} catch (err) {
				console.error("Error parsing keysString:", err);
			}

			try {
				const cleanedMembersString = membersString.replace(/\(/g, "[").replace(/\)/g, "]").replace(/'/g, '"');
				membersArray = JSON.parse(cleanedMembersString);
			} catch (err) {
				console.error("Error parsing membersString:", err);
			}

			return {
				keys: keysArray.map((data) => ({
					parentKey: data[0],
					kidKey: data[1],
				})),
				members: membersArray.map((member) => ({
					name: member[0],
					email: member[1],
					role: member[2],
				})),
			};
		} else if (response.status === 406) {
			console.error("Email already exists. Please choose a different email address.");
		} else {
			console.error("User creation was unsuccessful.");
		}
		return { keys: [], members: [] };
	} catch (err) {
		console.error("Error fetching family data:", err);
		return { keys: [], members: [] };
	}
}

export async function assignKidTask(kids_id, task, date_from, date_to, reward) {
	try {
		const formData = new FormData();
		formData.append("id", kids_id);
		formData.append("task", task);
		formData.append("date_from", date_from);
		formData.append("date_to", date_to);
		formData.append("reward", reward);

		const localApiAddress = apiAddress + "/Add_tasks";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			return true;
		} else if (response.status === 406) {
			console.error("Email already exists. Please choose a different email address.");
			return false;
		} else {
			console.error("User creation was unsuccessful.");
			return false;
		}
	} catch (err) {
		console.error("Error fetching kids' names:", err);
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

export async function assignFamilyTask(email_rodica , task, date_from, date_to, reward) {
	try {
		const formData = new FormData();
		formData.append("email", email_rodica);
		formData.append("task", task);
		formData.append("date_from", date_from);
		formData.append("date_to", date_to);
		formData.append("reward", reward);

		const localApiAddress = apiAddress + "/Family_task";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			return true;
		} else if (response.status === 500) {
			console.error("Email already exists. Please choose a different email address.");
			return false;
		} else {
			console.error("User creation was unsuccessful.");
			return false;
		}
	} catch (err) {
		console.error("Error fetching kids' names:", err);
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

export async function createReward(email, name, price) {
	try {
		const formData = new FormData();
		formData.append("email", email);
		formData.append("name", name);
		formData.append("value", price);

		const localApiAddress = apiAddress + "/Add_rewards";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			return true;
		} else {
			console.error("User creation was unsuccessful.");
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

export async function getRewards(email) {
	try {
		const formData = new FormData();
		formData.append("email", email);

		const localApiAddress = apiAddress + "/Select_rewards";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			// Extract rewards directly from the response
			const rewardsArray = response.data.return;

			// Map the rewards into objects with `name` and `price`
			const rewardsData = rewardsArray.map(([id, name, price]) => ({
				id,
				name,
				price,
			}));

			return rewardsData; // Return the processed rewards
		} else if (response.status === 406) {
			console.error("Email already exists. Please choose a different email address.");
			return [];
		} else {
			console.error("Failed to fetch rewards.");
			return [];
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
		return [];
	}
}

export async function removeReward(reward_id) {
	try {
		const formData = new FormData();
		formData.append("id", reward_id);

		const localApiAddress = apiAddress + "/Delete_reward";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			return true;
		} else {
			console.error("User creation was unsuccessful.");
			return false;
		}
	} catch (err) {
		console.error("Error fetching kids' names:", err);
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

export async function deleteFamily(email) {
	try {
		const formData = new FormData();
		formData.append("email", email);

		const localApiAddress = apiAddress + "/Delete_family";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			return true;
		} else if (response.status === 406) {
			console.error("Email already exists. Please choose a different email address.");
			return false;
		} else {
			console.error("User creation was unsuccessful.");
			return false;
		}
	} catch (err) {
		console.error("Error fetching kids' names:", err);
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

export async function removeFamilyMember(email) {
	try {
		const formData = new FormData();
		formData.append("email", email);

		const localApiAddress = apiAddress + "/Delete_member";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		console.error("Error fetching family data:", err);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			console.error("Network error. Please check your connection and try again.");
		} else {
			console.error("An unexpected error occurred. Please try again.");
		}
		return { keys: [], members: [] };
	}
}

export async function markKidRewardCompleted() {}

export async function getKidsNames(email) {
	try {
		const formData = new FormData();
		formData.append("email", email);

		const localApiAddress = apiAddress + "/Select";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			// Parse the response data (clean up the string into a valid JSON format)
			const kidsDataString = response.data.return;
			// Clean the string to resemble a valid JSON array format
			const cleanedString = kidsDataString
				.replace(/\(/g, "[") // Replace '(' with '['
				.replace(/\)/g, "]") // Replace ')' with ']'
				.replace(/'/g, '"'); // Replace single quotes with double quotes for valid JSON

			// Parse the cleaned string into an array
			const kidsData = JSON.parse(cleanedString);

			// Map the parsed data into an array of objects with id and name
			return kidsData.map((kid) => ({
				id: kid[0], // Assuming the ID is the first element in the tuple
				name: kid[1], // Assuming the name is the second element in the tuple
			}));
		} else if (response.status === 204) {
			return null;
		} else if (response.status === 406) {
			console.error("Email already exists. Please choose a different email address.");
		} else {
			console.error("User creation was unsuccessful.");
			return [];
		}
	} catch (err) {
		console.error("Error fetching kids' names:", err);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			console.error("Network error. Please check your connection and try again.");
		} else {
			console.error("An unexpected error occurred. Please try again.");
		}
		return [];
	}
}

export async function getKidsTasks(email) {
	try {
		const formData = new FormData();
		formData.append("email", email);

		const localApiAddress = apiAddress + "/Parents_tasks";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			// The response data already appears to be valid JSON; parse it directly
			const kidsTasks = response.data.return;

			// Map the tasks to a usable format
			return kidsTasks.map((task) => ({
				startDate: task.cas_od,
				endDate: task.cas_do,
				reward: task.cena_odmeny,
				task_id: task.id,
				name: task.meno,
				status: task.stav,
				task: task.uloha,
			}));
		} else {
			console.error("Failed to fetch tasks.");
			return [];
		}
	} catch (err) {
		console.error("Error fetching kids' tasks:", err);
		console.error("An error occurred while fetching tasks. Please try again later.");
		return [];
	}
}

export async function removeTask(task_id) {
	try {
		const formData = new FormData();
		formData.append("id", task_id);

		const localApiAddress = apiAddress + "/Delete_task";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			return true;
		} else {
			console.error("User creation was unsuccessful.");
			return false;
		}
	} catch (err) {
		console.error("Error fetching kids' names:", err);
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

export async function confirmTask(task_id) {
	try {
		const formData = new FormData();
		formData.append("id", task_id);

		const localApiAddress = apiAddress + "/Parents_Tconfirm";

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

export async function confirmReward(reward_id) {
	try {
		const formData = new FormData();
		formData.append("id", reward_id);

		const localApiAddress = apiAddress + "/Parents_Rconfirm";

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

export async function getKidsRewards(email) {
	try {
		const formData = new FormData();
		formData.append("email", email);

		const localApiAddress = apiAddress + "/Parents_rewards";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			const rawResponse = response.data.return; // Get the 'return' string
			console.log("Raw API Response:", rawResponse);

			// Pre-process and fix any formatting issues with the raw response
			const sanitizedResponse = rawResponse
				.replace(/\(/g, "[") // Replace '(' with '['
				.replace(/\)/g, "]") // Replace ')' with ']'
				.replace(/'/g, '"') // Replace single quotes with double quotes
				.replace(/\bFalse\b/g, "false") // Replace `False` with `false`
				.replace(/\bTrue\b/g, "true"); // Replace `True` with `true`

			console.log("Sanitized API Response:", sanitizedResponse);

			// Parse the sanitized response
			const rewardsList = JSON.parse(sanitizedResponse);

			// Map the list into objects
			const rewards = rewardsList.map(([id, name, reward, isCompleted]) => ({
				id,
				name,
				reward,
				isCompleted,
			}));

			return rewards;
		} else {
			console.error("Unexpected API response status:", response.status);
			return [];
		}
	} catch (err) {
		console.error("Error fetching rewards:", err);
		if (err.response) {
			console.error(`Server Error: ${err.response.data.message || "An error occurred."}`);
		} else if (err.request) {
			console.error("Network Error. Please check your connection.");
		} else {
			console.error("Unexpected Error. Please try again.");
		}
		return [];
	}
}
