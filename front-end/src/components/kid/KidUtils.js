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
            const { return: taskString, return1: rewardString, return2: credits } = response.data;

            const cleanedTaskString = taskString
            .replace(/\(/g, "[")
            .replace(/\)/g, "]")
            .replace(/'/g, '"');
        
        const tasks = JSON.parse(cleanedTaskString).map((task) => ({
            id: task.id,
            name: task.uloha, // Použije sa názov úlohy z údajov
            status: task.stav,
        }));

            // Parsovanie a čistenie dát pre odmeny
        // Parsovanie a čistenie dát pre odmeny (return1)
        const cleanedRewardString = rewardString
            .replace(/\(/g, "[")
            .replace(/\)/g, "]")
            .replace(/'/g, '"');

        // Získanie odmien zo servera a nastavenie stavu na "True" alebo "False"
        const rewards = JSON.parse(cleanedRewardString).map((reward) => ({
            name: reward.name,
            status: reward.stav,
        }));


            // Spracovanie kreditov (parsujeme a zabezpečíme, že je to číslo)
            let formattedCredits = 0;
            if (credits && credits.length > 0) {
                const creditValue = JSON.parse(credits)[0]; // Získame prvú hodnotu z poľa
                formattedCredits = !isNaN(Number(creditValue)) ? Number(creditValue) : 0; // Konverzia na číslo
            }

            return {
                tasks,
                rewards,
                credits: formattedCredits,
            };
        } else if (response.status === 406) {
            alert("Nepovolený prístup.");
        } else {
            alert("Neznáma chyba.");
            return { tasks: [], rewards: [], credits: 0 };
        }
    } catch (err) {
        console.error("Chyba pri spracovaní odpovede:", err);

        if (err.response) {
            alert(`Chyba: ${err.response.data.message || "Chyba zo servera."}`);
        } else if (err.request) {
            alert("Server neodpovedá.");
        } else {
            alert("Nastala nečakaná chyba.");
        }
        return { tasks: [], rewards: [], credits: 0 };
    }
}








export async function getTasks() {};

export async function getCompletedTasks() {};

export async function getAvailableRewards() {};

export async function markTaskComplete() {};

export async function exchangePointsForRewards() {};
