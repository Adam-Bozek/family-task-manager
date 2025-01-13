import Axios from "axios";

const apiAddress = "http://147.232.205.117:5000/api";

export async function getFamilyData(email) {
	try {
		const formData = new FormData();
		formData.append("email", email);
		const localApiAddress = apiAddress + "/Hash";

		const response = await Axios.post(localApiAddress, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (response.status === 202) {
			const { return: keysString, return2: membersString } = response.data;
			if (!keysString || !membersString) {
				console.error("Response is missing 'keysString' or 'membersString'.");
				return { keys: [], members: [] };
			}

			let keysArray = [];
			let membersArray = [];
			try {
				const cleanedKeysString = keysString.replace(/\(/g, "[").replace(/\)/g, "]").replace(/'/g, '"');
				keysArray = JSON.parse(cleanedKeysString);
			} catch (err) {
				console.error("Failed to parse 'keysString'. Ensure the response format is valid. Error:", err);
			}

			try {
				const cleanedMembersString = membersString.replace(/\(/g, "[").replace(/\)/g, "]").replace(/'/g, '"');
				membersArray = JSON.parse(cleanedMembersString);
			} catch (err) {
				console.error("Failed to parse 'membersString'. Ensure the response format is valid. Error:", err);
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
			console.error("The email already exists. Use a different email address.");
		} else {
			console.error(`Unexpected response status ${response.status}: Unable to fetch family data.`);
		}

		return { keys: [], members: [] };
	} catch (err) {
		console.error("An error occurred while fetching family data:", err);
		if (err.response) {
			console.error(`Server Error: ${err.response.data.message || "Unexpected server response."}`);
		} else if (err.request) {
			console.error("No response received from the server. Check your network connection.");
		} else {
			console.error("Unexpected error occurred:", err.message);
		}
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
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (response.status === 202) {
			return true;
		} else if (response.status === 406) {
			console.error("The email already exists. Choose a different email address.");
			return false;
		} else {
			console.error("Failed to assign the task. Status code:", response.status);
			return false;
		}
	} catch (err) {
		console.error("Error occurred while assigning kid task:", err);
		if (err.response) {
			console.error(`Server Error: ${err.response.data.message || "Unexpected server response."}`);
		} else if (err.request) {
			console.error("No response from the server. Please check your network connection.");
		} else {
			console.error("Unexpected error occurred:", err.message);
		}
		return false;
	}
}

export async function assignFamilyTask(email_rodica, task, date_from, date_to, reward) {
	try {
		const formData = new FormData();
		formData.append("email", email_rodica);
		formData.append("task", task);
		formData.append("date_from", date_from);
		formData.append("date_to", date_to);
		formData.append("reward", reward);

		const localApiAddress = apiAddress + "/Family_task";
		const response = await Axios.post(localApiAddress, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (response.status === 202) {
			return true;
		} else if (response.status === 500) {
			console.error("The email already exists. Choose a different email address.");
			return false;
		} else {
			console.error("Failed to assign family task. Status code:", response.status);
			return false;
		}
	} catch (err) {
		console.error("Error occurred while assigning family task:", err);
		if (err.response) {
			console.error(`Server Error: ${err.response.data.message || "Unexpected server response."}`);
		} else if (err.request) {
			console.error("No response received. Check your network connection.");
		} else {
			console.error("Unexpected error occurred:", err.message);
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
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (response.status === 202) {
			return true;
		} else {
			console.error("Failed to create reward. Status code:", response.status);
			return false;
		}
	} catch (err) {
		console.error("Error occurred while creating reward:", err);
		if (err.response) {
			console.error(`Server Error: ${err.response.data.message || "Unexpected server error."}`);
		} else if (err.request) {
			console.error("No response received. Check your network connection.");
		} else {
			console.error("Unexpected error occurred:", err.message);
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
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (response.status === 202) {
			const rewardsArray = response.data.return;
			const rewardsData = rewardsArray.map(([id, name, price]) => ({
				id,
				name,
				price,
			}));
			return rewardsData;
		} else if (response.status === 406) {
			console.error("Email already exists. Please choose a different email address.");
			return [];
		} else {
			console.error("Failed to fetch rewards. Status code:", response.status);
			return [];
		}
	} catch (err) {
		console.error("Error occurred while fetching rewards:", err);
		if (err.response) {
			console.error(`Server Error: ${err.response.data.message || "Unexpected server error."}`);
		} else if (err.request) {
			console.error("Network error. Check your connection.");
		} else {
			console.error("Unexpected error occurred:", err.message);
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
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (response.status === 202) {
			return true;
		} else {
			console.error("Failed to remove reward. Status code:", response.status);
			return false;
		}
	} catch (err) {
		console.error("Error occurred while removing reward:", err);
		if (err.response) {
			console.error(`Server Error: ${err.response.data.message || "Unexpected server error."}`);
		} else if (err.request) {
			console.error("No response received. Check your network connection.");
		} else {
			console.error("Unexpected error occurred:", err.message);
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
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (response.status === 202) {
			return true;
		} else if (response.status === 406) {
			console.error("Email already exists. Choose a different email address.");
			return false;
		} else {
			console.error("Failed to delete family. Status code:", response.status);
			return false;
		}
	} catch (err) {
		console.error("Error occurred while deleting family:", err);
		if (err.response) {
			console.error(`Server Error: ${err.response.data.message || "Unexpected server error."}`);
		} else if (err.request) {
			console.error("No response received. Check your network connection.");
		} else {
			console.error("Unexpected error occurred:", err.message);
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
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (response.status === 202) {
			return true;
		} else {
			console.error("Failed to remove family member. Status code:", response.status);
			return false;
		}
	} catch (err) {
		console.error("Error occurred while removing family member:", err);
		if (err.response) {
			console.error(`Server Error: ${err.response.data.message || "Unexpected server error."}`);
		} else if (err.request) {
			console.error("Network error. Check your connection.");
		} else {
			console.error("Unexpected error occurred:", err.message);
		}
		return { keys: [], members: [] };
	}
}

export async function getKidsNames(email) {
	try {
		const formData = new FormData();
		formData.append("email", email);
		const localApiAddress = apiAddress + "/Select";

		const response = await Axios.post(localApiAddress, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (response.status === 202) {
			const kidsDataString = response.data.return;
			const cleanedString = kidsDataString.replace(/\(/g, "[").replace(/\)/g, "]").replace(/'/g, '"');
			const kidsData = JSON.parse(cleanedString);

			return kidsData.map((kid) => ({
				id: kid[0],
				name: kid[1],
			}));
		} else if (response.status === 204) {
			return null;
		} else {
			console.error("Failed to fetch kids' names. Status code:", response.status);
			return [];
		}
	} catch (err) {
		console.error("Error occurred while fetching kids' names:", err);
		if (err.response) {
			console.error(`Server Error: ${err.response.data.message || "Unexpected server error."}`);
		} else if (err.request) {
			console.error("Network error. Check your connection.");
		} else {
			console.error("Unexpected error occurred:", err.message);
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
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (response.status === 202) {
			const kidsTasks = response.data.return;
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
			console.error("Failed to fetch kids' tasks. Status code:", response.status);
			return [];
		}
	} catch (err) {
		console.error("Error occurred while fetching kids' tasks:", err);
		if (err.response) {
			console.error(`Server Error: ${err.response.data.message || "Unexpected server error."}`);
		} else if (err.request) {
			console.error("Network error. Check your connection.");
		} else {
			console.error("Unexpected error occurred:", err.message);
		}
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
			console.error("Failed to remove task. Please try again.");
			return false;
		}
	} catch (err) {
		console.error("Error occurred while removing task:", err);
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
			console.error("Failed to confirm task. Please try again.");
			return false;
		}
	} catch (err) {
		console.error("Error occurred while confirming task:", err);
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
			console.error("Failed to confirm reward. Please try again.");
			return false;
		}
	} catch (err) {
		console.error("Error occurred while confirming reward:", err);
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
			const rawResponse = response.data.return;

			const sanitizedResponse = rawResponse
				.replace(/\(/g, "[")
				.replace(/\)/g, "]")
				.replace(/'/g, '"')
				.replace(/\bFalse\b/g, "false")
				.replace(/\bTrue\b/g, "true");

			const rewardsList = JSON.parse(sanitizedResponse);

			const rewards = rewardsList.map(([id, name, reward, isCompleted]) => ({
				id,
				name,
				reward,
				isCompleted,
			}));

			return rewards;
		} else {
			console.error("Failed to fetch rewards. Status code:", response.status);
			return [];
		}
	} catch (err) {
		console.error("Error occurred while fetching kids' rewards:", err);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "An error occurred while fetching rewards."}`);
		} else if (err.request) {
			console.error("Network error. Please check your connection and try again.");
		} else {
			console.error("An unexpected error occurred. Please try again.");
		}
		return [];
	}
}
