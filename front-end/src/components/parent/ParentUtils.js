import Axios from "axios";

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
        .replace(/\(/g, '[')   // Replace '(' with '['
        .replace(/\)/g, ']')   // Replace ')' with ']'
        .replace(/'/g, '"');   // Replace single quotes with double quotes for valid JSON

      // Now we can safely parse the string into a JavaScript array
      const kidsData = JSON.parse(cleanedString);

      // Extract only the names from the parsed data
      return kidsData.map(kid => kid[1]); // Assuming the name is the second element in each tuple
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

