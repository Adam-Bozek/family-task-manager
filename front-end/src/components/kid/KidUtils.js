import Axios from "axios";

const apiAddress = "http://147.232.205.117:5000/api";

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

			let tasks = [];
			let tasksToChooseFrom = [];
			let rewards = [];
			let credits = 0;

			if (data.return) {
				try {
					tasks = JSON.parse(data.return.replace(/'/g, '"'));
				} catch (err) {
					console.error("Error parsing tasks:", err.message);
				}
			}

			if (data.return1) {
				try {
					const correctedData = data.return1.replace(/'/g, '"');
					const formattedData = correctedData.replace(/\((.*?)\)/g, "[$1]");
					const rawRewards = JSON.parse(formattedData);
					rewards = rawRewards.map(([name, status]) => ({
						name,
						status: status === "true",
					}));
				} catch (err) {
					console.error("Error parsing rewards:", err.message);
				}
			}

			if (data.return2) {
				try {
					const rawCredits = eval(data.return2);
					credits = parseFloat(rawCredits[0]) || 0;
				} catch (err) {
					console.error("Error parsing credits:", err.message);
				}
			}

			if (data.return3) {
				try {
					const correctedReturn3 = data.return3.replace(/'/g, '"');
					tasksToChooseFrom = JSON.parse(correctedReturn3);
				} catch (err) {
					console.error("Error parsing tasks_to_choose_from:", err.message);
				}
			}

			return { tasks, tasksToChooseFrom, rewards, credits };
		} else {
			console.error(`Unexpected status code: ${response.status}`);
		}
	} catch (err) {
		console.error("Error fetching points:", err.message);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."} (Status: ${err.response.status})`);
		} else if (err.request) {
			console.error("Network error. Please check your connection and try again.");
		} else {
			console.error("An unexpected error occurred. Please try again.");
		}
		return {};
	}
}

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
			console.error("Failed to confirm user task completion.");
			return false;
		}
	} catch (err) {
		console.error("Error marking task complete:", err.message);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."} (Status: ${err.response.status})`);
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
			console.error("Failed to assign task to user.");
			return false;
		}
	} catch (err) {
		console.error("Error marking task as mine:", err.message);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."} (Status: ${err.response.status})`);
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

		const localApiAddress = apiAddress + "/Wallet";

		const response = await Axios.post(localApiAddress, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 202) {
			const remainingCredits = parseFloat(response.data.return.replace(/[\[\]]/g, ""));
			const rewardsArray = JSON.parse(response.data.return1.replace(/'/g, '"').replace(/\((.*?)\)/g, "[$1]"));

			const rewards = rewardsArray.map(([id, name, price]) => ({
				id,
				name,
				price,
			}));

			return { remainingCredits, rewards };
		} else {
			console.error(`Failed to fetch rewards. Status code: ${response.status}`);
			return { remainingCredits: 0, rewards: [] };
		}
	} catch (err) {
		console.error("Error fetching rewards:", err.message);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."} (Status: ${err.response.status})`);
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
			const remainingCredits = parseFloat(response.data.return.replace(/[\[\]]/g, ""));
			const rewardsArray = JSON.parse(response.data.return1.replace(/'/g, '"').replace(/\((.*?)\)/g, "[$1]"));

			const rewards = rewardsArray.map(([id, name, price]) => ({
				id,
				name,
				price,
			}));

			return { remainingCredits, rewards };
		} else {
			console.error(`Failed to fetch exchanged rewards. Status code: ${response.status}`);
			return { remainingCredits: 0, rewards: [] };
		}
	} catch (err) {
		console.error("Error fetching exchanged rewards:", err.message);
		if (err.response) {
			console.error(`Error: ${err.response.data.message || "Server error. Please try again later."} (Status: ${err.response.status})`);
		} else if (err.request) {
			console.error("Network error. Please check your connection and try again.");
		} else {
			console.error("An unexpected error occurred. Please try again.");
		}
		return { remainingCredits: 0, rewards: [] };
	}
}
