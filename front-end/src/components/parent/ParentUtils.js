const apiAddress = "http://147.232.205.117:5000";


// Functions for user "parent"
export async function getKidsAndTasks() {
};

export async function getKidsRewards() {};

export async function getFamilyMember() {};

export async function getKeyForParentToJoin() {};

export async function getKeyForKidToJoin() {};

export async function getRewards() {};

export async function assignTask() {};

export async function addReward() {};

export async function removeReward() {};

export async function deleteFamily() {};

export async function removeFamilyMember() {};

export async function markKidRewardCompleted() {};


// get kids
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


    if (response.status === 201) {
			alert("User successfully created.");
			return response.data;
		}
		else if(response.status === 406) {
		  alert("Email already exists. Please choose a different email address.");
		} else {
			alert("User creation was unsuccessful.");
			return false;
		}
  } catch (err) {
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
};