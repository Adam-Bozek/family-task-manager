import React, { useState, useContext, useEffect } from "react";
import styles from "../css/ParentSettings.module.css";
import { useNavigate } from "react-router-dom";

import { logOutUser } from "../utilities/Utils";
import { AppContext } from "../utilities/AppContext";

import { getFamilyData, deleteFamily, removeFamilyMember } from "./ParentUtils";

// Main component for Parent Settings
const ParentSettings = () => {
	// React state hooks for managing various aspects of the component
	const [activeTab, setActiveTab] = useState("members");
	const [rewards, setRewards] = useState([{ name: "PC - 30 minút", price: 20 }]);
	const [newReward, setNewReward] = useState({ name: "", price: "" });
	const [kidJoinKey, setKidJoinKey] = useState("");
	const [parentJoinKey, setParentJoinKey] = useState("");
	const [familyMembers, setFamilyMembers] = useState([]);
	const [removedEmail, setRemovedEmail] = useState("");
	const [removedRole, setRemovedRole] = useState("");
	const [selectedMemberEmail, setSelectedMemberEmail] = useState("");

	// Context hooks for shared app-wide state
	const { email, setName, setIsLoggedIn, setEmail, setRole } = useContext(AppContext);

	// Fetch family data when the component is mounted or when the email changes
	useEffect(() => {
		const familyData = async () => {
			try {
				const { keys, members } = await getFamilyData(email);

				if (keys && keys.length > 0) {
					const { parentKey, kidKey } = keys[0]; // Assume first pair of keys
					setParentJoinKey(parentKey);
					setKidJoinKey(kidKey);
				} else {
					console.warn("No keys found in fetched data");
				}

				if (members && members.length > 0) {
					setFamilyMembers(members);
				} else {
					console.warn("No family members found in fetched data");
				}
			} catch (err) {
				console.error("Error fetching family data:", err);
			}
		};

		familyData();
	}, [email]);

	// Navigation hook to handle route redirection
	const navigate = useNavigate();

	// Handles navigation to a given route
	const handle_redirect = (route) => {
		navigate(route);
	};

	// Handles adding a new reward
	const handleAddReward = (event) => {
		event.preventDefault();
		if (newReward.name && newReward.price) {
			setRewards([...rewards, { name: newReward.name, price: parseInt(newReward.price) }]);
			setNewReward({ name: "", price: "" });
		}
	};

	// Handles deleting the entire family
	const handleDeleteFamily = async (email) => {
		try {
			const res = await deleteFamily(email);

			if (res === true) {
				logOutUser(setIsLoggedIn, setEmail, setRole);
				handle_redirect("/");
			} else {
				console.error("Failed to delete family:", res.message);
			}
		} catch (e) {
			console.error("Failed to delete family:", e);
		}
	};

	// Handles removing a selected family member
	const handle_member_removal = async () => {
		if (!selectedMemberEmail) {
			alert("Vyberte člena na odstránenie.");
			return;
		}

		if (!removedEmail || !removedRole) {
			alert("Zadajte email a rolu člena.");
			return;
		}

		const selectedMember = familyMembers.find((member) => member.email === selectedMemberEmail);

		if (!selectedMember) {
			alert("Vybraný člen neexistuje.");
			return;
		}

		if (selectedMember.email !== removedEmail || selectedMember.role !== removedRole) {
			alert("Zadané údaje (email alebo rola) sa nezhodujú so zvoleným členom.");
			return;
		}

		try {
			const res = await removeFamilyMember(selectedMemberEmail);

			if (res === true) {
				alert("Člen bol úspešne odstránený.");
				setFamilyMembers((prev) => prev.filter((m) => m.email !== selectedMemberEmail));
				setRemovedEmail("");
				setRemovedRole("");
				setSelectedMemberEmail("");
			} else {
				alert("Odstránenie člena zlyhalo.");
			}
		} catch (e) {
			console.error("Error removing member:", e);
			alert("Odstránenie člena zlyhalo.");
		}
	};

	// Renders the content of the selected tab
	const renderTabContent = () => {
		switch (activeTab) {
			case "members":
				return (
					<div className={styles.membersContainer}>
						<div className={styles.column}>
							<div className={styles.memberList}>
								<h2>Pridaní členovia</h2>
								<table className={styles.table}>
									<thead>
										<tr>
											<th>
												<h4>Člen</h4>
											</th>
											<th>
												<h4>Email člena</h4>
											</th>
											<th>
												<h4>Rola</h4>
											</th>
										</tr>
									</thead>
									<tbody>
										{familyMembers.map((member, index) => (
											<tr key={index}>
												<td>{member.name}</td>
												<td>{member.email}</td>
												<td>{member.role === "kid" ? "Dieťa" : member.role === "parent" ? "Rodič" : member.role}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<p className={`${styles.infoText} ${styles.leftText}`}>Kód na pridanie rodiča: {parentJoinKey}</p>
						</div>
						<div className={styles.column}>
							<div className={styles.removeMember}>
								<h3>Odobrať člena</h3>
								<form onSubmit={(e) => e.preventDefault()}>
									<select
										className={styles.inputField}
										onChange={(e) => {
											setRemovedEmail(""); // Reset inputs to prevent accidental matches
											setRemovedRole("");
											setSelectedMemberEmail(e.target.value); // Track selected member
										}}>
										<option value="" disabled selected>
											Vyberte člena
										</option>
										{familyMembers.map((member, index) => (
											<option key={index} value={member.email}>
												{member.name}
											</option>
										))}
									</select>
									<input
										type="email"
										placeholder="Email"
										className={styles.inputField}
										value={removedEmail}
										onChange={(e) => setRemovedEmail(e.target.value)}
									/>
									<input
										type="text"
										placeholder="Rola (napr. kid alebo parent)"
										className={styles.inputField}
										value={removedRole}
										onChange={(e) => setRemovedRole(e.target.value)}
									/>
									<button type="submit" className={styles.submitButton} onClick={() => handle_member_removal()}>
										Potvrdiť
									</button>
								</form>
							</div>
							<p className={`${styles.infoText} ${styles.rightText}`}>Kód na pridanie dieťaťa: {kidJoinKey}</p>
						</div>
					</div>
				);

			case "rewards":
				return (
					<div className={styles.rewardsContainer}>
						<div className={styles.column}>
							<div className={styles.rewardList}>
								<h2>Nastavené odmeny</h2>
								<table className={styles.table}>
									<thead>
										<tr>
											<th>
												<h4>Odmena</h4>
											</th>
											<th>
												<h4>Cena Odmeny</h4>
											</th>
										</tr>
									</thead>
									<tbody>
										{rewards.map((reward, index) => (
											<tr key={index}>
												<td>{reward.name}</td>
												<td>{reward.price} kreditov</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						<div className={styles.column}>
							<div className={styles.addReward}>
								<h3>Pridať odmenu</h3>
								<form onSubmit={handleAddReward}>
									<input
										type="text"
										placeholder="Odmena"
										className={styles.inputField}
										value={newReward.name}
										onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
									/>
									<input
										type="number"
										placeholder="Cena"
										className={styles.inputField}
										value={newReward.price}
										onChange={(e) => setNewReward({ ...newReward, price: e.target.value })}
									/>
									<button type="submit" className={styles.submitButton}>
										Pridať odmenu
									</button>
								</form>
							</div>
						</div>
					</div>
				);

			case "cancel":
				return (
					<div className={styles.cancelFamily}>
						<h2>Naozaj si prajete zrušiť rodinu?</h2>
						<button className={styles.cancelButton} onClick={() => handleDeleteFamily(email)}>
							Áno
						</button>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<main className={styles.mainContainer}>
			<div className={styles.blurContainer}>
				<header className={`container my-3 ${styles["navbar-settings"]}`}>
					<nav className={`navbar navbar-expand-lg bg-body-tertiary p-2 rounded-4 ${styles["background"]}`} aria-label="Navbar">
						<div className={`container-fluid`}>
							<button
								className="navbar-toggler"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#navbarsExample12"
								aria-controls="navbarsExample12"
								aria-expanded="false"
								aria-label="Toggle navigation">
								<span className="navbar-toggler-icon"></span>
							</button>
							<div className="collapse navbar-collapse d-lg-flex" id="navbarsExample12">
								<span className="navbar-brand col-lg-3 me-0" />
								<ul className="navbar-nav col-lg-6 justify-content-lg-center">
									<li className="nav-item ">
										<button className={`nav-link ${styles["nav-font-weight"]}`} onClick={() => handle_redirect("/ParentDashboardTasks")}>
											Domov
										</button>
									</li>
									<li className="nav-item mx-4">
										<button
											className={`nav-link ${styles["nav-font-weight"]} active`}
											onClick={() => handle_redirect("/ParentSettings")}
											aria-current="page">
											Nastavenia
										</button>
									</li>
									<li className="nav-item">
										<button className={`nav-link ${styles["nav-font-weight"]}`} onClick={() => handle_redirect("/ParentTasks")}>
											Pridať úlohu
										</button>
									</li>
								</ul>
								<div className="d-lg-flex col-lg-3 justify-content-lg-end">
									<button
										className={`btn btn-dark ${styles["nav-button-weight"]} rounded-4 my-1`}
										onClick={() => logOutUser(setName, setIsLoggedIn, setEmail)}>
										Odhlásiť sa
									</button>
								</div>
							</div>
						</div>
					</nav>
				</header>
				<div className={styles.content}>
					<div className={styles.navbar}>
						<button className={activeTab === "members" ? styles.activeTab : ""} onClick={() => setActiveTab("members")}>
							Členovia
						</button>
						<button className={activeTab === "rewards" ? styles.activeTab : ""} onClick={() => setActiveTab("rewards")}>
							Odmeny
						</button>
						<button className={activeTab === "cancel" ? styles.activeTab : ""} onClick={() => setActiveTab("cancel")}>
							Zrušenie rodiny
						</button>
					</div>

					{renderTabContent()}
				</div>
			</div>
		</main>
	);
};

export default ParentSettings;
