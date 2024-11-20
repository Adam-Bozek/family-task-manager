import Axios from "axios";

const apiAddress = "http://147.232.205.117:5000";

// Functions for user "parent"
export async function getKidsAndTasks() {}

export async function getKidsRewards() {}

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
			// Parse the response data
			const { return: keysString, return1: membersString } = response.data;

			// Clean and parse `keysString`
			const cleanedKeysString = keysString
				.replace(/\(/g, "[") // Replace '(' with '['
				.replace(/\)/g, "]") // Replace ')' with ']'
				.replace(/'/g, '"'); // Replace single quotes with double quotes for valid JSON

			const keysArray = JSON.parse(cleanedKeysString);

			// Map `keysArray` to an array of objects
			const keyData = keysArray.map((data) => ({
				parentKey: data[0],
				kidKey: data[1],
			}));

			// Clean and parse `membersString`
			const cleanedMembersString = membersString
				.replace(/\(/g, "[") // Replace '(' with '['
				.replace(/\)/g, "]") // Replace ')' with ']'
				.replace(/'/g, '"'); // Replace single quotes with double quotes for valid JSON

			const membersArray = JSON.parse(cleanedMembersString);

			// Map `membersArray` to an array of objects
			const familyMembers = membersArray.map((member) => ({
				name: member[0],
				email: member[1],
				role: member[2],
			}));

			// Combine and return both data sets
			return {
				keys: keyData,
				members: familyMembers,
			};
		} else if (response.status === 406) {
			alert("Email already exists. Please choose a different email address.");
		} else {
			alert("User creation was unsuccessful.");
			return { keys: [], members: [] };
		}
	} catch (err) {
		console.error("Error fetching family data:", err);
		if (err.response) {
			alert(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			alert("Network error. Please check your connection and try again.");
		} else {
			alert("An unexpected error occurred. Please try again.");
		}
		return { keys: [], members: [] };
	}
}

export async function assignTask(kids_id, task, date_from, date_to, reward) {
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

		if (response.status === 200) {
			return true;
		} else if (response.status === 406) {
			alert("Email already exists. Please choose a different email address.");
			return false;
		} else {
			alert("User creation was unsuccessful.");
			return false;
		}
	} catch (err) {
		console.error("Error fetching kids' names:", err);
		if (err.response) {
			alert(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			alert("Network error. Please check your connection and try again.");
		} else {
			alert("An unexpected error occurred. Please try again.");
		}
		return false;
	}
}

export async function addReward() {}

export async function removeReward() {}

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
			alert("Email already exists. Please choose a different email address.");
			return false;
		} else {
			alert("User creation was unsuccessful.");
			return false;
		}
	} catch (err) {
		console.error("Error fetching kids' names:", err);
		if (err.response) {
			alert(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			alert("Network error. Please check your connection and try again.");
		} else {
			alert("An unexpected error occurred. Please try again.");
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
			alert(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			alert("Network error. Please check your connection and try again.");
		} else {
			alert("An unexpected error occurred. Please try again.");
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
			alert("Email already exists. Please choose a different email address.");
		} else {
			alert("User creation was unsuccessful.");
			return [];
		}
	} catch (err) {
		console.error("Error fetching kids' names:", err);
		if (err.response) {
			alert(`Error: ${err.response.data.message || "Server error. Please try again later."}`);
		} else if (err.request) {
			alert("Network error. Please check your connection and try again.");
		} else {
			alert("An unexpected error occurred. Please try again.");
		}
		return [];
	}
}
