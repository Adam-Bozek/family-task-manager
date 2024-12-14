// Functions for user "kid"
export async function getPoints() {};

    export async function getTasks() {};

    export async function getCompletedTasks() {};

    export async function getAvailableRewards() {};

    export async function markTaskComplete() {};

    export async function exchangePointsForRewards() {};

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
                        .replace(/\((.*?)\)/g, "[$1]") // Replace parentheses with brackets
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
                        .replace(/\((.*?)\)/g, "[$1]") // Replace parentheses with brackets
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
