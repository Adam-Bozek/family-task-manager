import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { logOutUser } from "../utilities/Utils";
import { AppContext } from "../utilities/AppContext";
import { getKidsNames, assignTask } from "./ParentUtils";

import styles from "../css/ParentAddTask.module.css";

const ParentAddTask = () => {
	// State for tasks and task details
	const [tasks, setTasks] = useState({});
	const [taskData, setTaskData] = useState({
		name: "",
		task: "",
		startDate: "",
		endDate: "",
		reward: "",
	});

	// State for kids' list and selected kid
	const [kids, setKids] = useState([]);
	const [selectedKid, setSelectedKid] = useState("Vybrať dieťa");
	const [selectedKidId, setSelectedKidId] = useState(null);

	// State for rewards and selected reward
	const [selectedReward, setSelectedReward] = useState("Vybrať odmenu");
	const rewardsList = ["Hodina na Xboxe", "Extra dezert", "Výlet do kina", "Nová hračka", "Peniaze"];

	// State for tooltip
	const [tooltip, setTooltip] = useState({ visible: false, taskInfo: null });

	// App context to fetch email
	const { email, setName, setIsLoggedIn, setEmail } = useContext(AppContext);

	// Navigation function
	const navigate = useNavigate();
	const handleRedirect = (route) => {
		navigate(route);
	};

	// Fetch kids' names when the component mounts
	useEffect(() => {
		const fetchKidsData = async () => {
			try {
				const fetchedKids = await getKidsNames(email);
				setKids(fetchedKids); // Fetched data includes both `id` and `name`
				console.log(fetchedKids);
			} catch (err) {
				console.error("Error fetching kids' names:", err);
			}
		};
		fetchKidsData();
	}, [email]);

	// Add a new task for the selected kid
	const addTask = async () => {
		// Mark the function as async
		if (selectedKid && taskData.task) {
			// Make the async call to assign the task first
			try {
				const res = await assignTask(selectedKidId, taskData.task, taskData.startDate, taskData.endDate, taskData.reward);

				// If res is false (indicating an error or failure), skip adding the task
				if (!res) {
					console.error("Task assignment failed. Task will not be added.");
					return; // Exit the function early if the task assignment failed
				}

				// If task assignment succeeded, then add the task to the local state
				setTasks((prevTasks) => {
					const userTasks = prevTasks[selectedKid] || [];
					return {
						...prevTasks,
						[selectedKid]: [...userTasks, { ...taskData, color: getRandomColor() }],
					};
				});

				console.log("Task assigned successfully:", res);
			} catch (error) {
				console.error("Error assigning task:", error);
			}

			// Clear task data after attempting to add
			setTaskData({ name: "", task: "", startDate: "", endDate: "", reward: "" });
		}
	};

	// Remove a specific task for a user
	const removeTask = (userName, taskIndex) => {
		setTasks((prevTasks) => {
			const userTasks = [...prevTasks[userName]];
			userTasks.splice(taskIndex, 1);
			if (userTasks.length === 0) {
				const { [userName]: _, ...rest } = prevTasks;
				return rest;
			}
			return { ...prevTasks, [userName]: userTasks };
		});
		setTooltip({ visible: false, taskInfo: null });
	};

	// Show tooltip for a task
	const showTooltip = (task) => {
		setTooltip({ visible: true, taskInfo: task });
	};

	// Hide tooltip
	const hideTooltip = () => {
		setTooltip({ visible: false, taskInfo: null });
	};

	// Handle input change in the form
	const handleInputChange = (e) => {
		setTaskData({ ...taskData, [e.target.name]: e.target.value });
	};

	// Generate a random color for task box
	const getRandomColor = () => {
		const colorPalette = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD", "#E67E22", "#1ABC9C", "#D35400", "#2C3E50", "#C0392B"];
		return colorPalette[Math.floor(Math.random() * colorPalette.length)];
	};

	return (
		<div className={styles["templateMain"]}>
			<div className={styles["blur-container"]}>
				<header className={`container my-3 ${styles["navbar-settings"]}`}>
					<nav className={`navbar navbar-expand-lg bg-body-tertiary p-2 rounded-4 ${styles["background"]}`} aria-label="Thirteenth navbar example">
						<div className={`container-fluid`}>
							<button
								className="navbar-toggler"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#navbarsExample11"
								aria-controls="navbarsExample11"
								aria-expanded="false"
								aria-label="Toggle navigation">
								<span className="navbar-toggler-icon"></span>
							</button>
							<div className="collapse navbar-collapse d-lg-flex" id="navbarsExample11">
								<span className="navbar-brand col-lg-3 me-0" />
								<ul className="navbar-nav col-lg-6 justify-content-lg-center">
									<li className="nav-item">
										<button className={`nav-link ${styles["nav-font-weight"]}`} onClick={() => handleRedirect("/ParentDashboardTasks")}>
											Domov
										</button>
									</li>
									<li className="nav-item mx-4">
										<button className={`nav-link ${styles["nav-font-weight"]}`} onClick={() => handleRedirect("/ParentSettings")}>
											Nastavenia
										</button>
									</li>
									<li className="nav-item">
										<button className={`nav-link ${styles["nav-font-weight"]} active`} aria-current="page" onClick={() => handleRedirect("/ParentTasks")}>
											Zadať úlohu
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
				<div className={styles.mainContainer}>
					<div className={styles.formContainer}>
						<h3>Zadanie Úloh</h3>
						<div className="dropdown m-3">
							<button
								className={`btn btn-secondary dropdown-toggle ${styles.confirmButton}`}
								type="button"
								data-bs-toggle="dropdown"
								aria-expanded="false">
								{selectedKid}
							</button>
							<ul className="dropdown-menu">
								{kids && kids.length > 0 ? ( // Check if there are kids
									kids.map((kid) => (
										<li key={kid.id}>
											<a
												className="dropdown-item"
												href="#"
												onClick={() => {
													setTaskData({ ...taskData, name: kid.name });
													setSelectedKid(kid.name);
													setSelectedKidId(kid.id);
												}}>
												{kid.name}
											</a>
										</li>
									))
								) : (
									<li>
										<span className="dropdown-item text-muted">Žiadne deti na výber</span>
									</li>
								)}
							</ul>
						</div>
						<input name="task" placeholder="Úloha" value={taskData.task} onChange={handleInputChange} className={styles.input} />
						<input
							name="startDate"
							placeholder="Od (dd. mm. rrrr)"
							value={taskData.startDate}
							onChange={handleInputChange}
							className={styles.input}
							type="date"
						/>
						<input
							name="endDate"
							placeholder="Do (dd. mm. rrrr)"
							value={taskData.endDate}
							onChange={handleInputChange}
							className={styles.input}
							type="date"
						/>
						<div className="dropdown m-3">
							<button
								className={`btn btn-secondary dropdown-toggle ${styles.confirmButton}`}
								type="button"
								data-bs-toggle="dropdown"
								aria-expanded="false">
								{selectedReward}
							</button>
							<ul className="dropdown-menu">
								{rewardsList.map((reward, index) => (
									<li key={index}>
										<a
											className="dropdown-item"
											href="#"
											onClick={() => {
												setTaskData({ ...taskData, reward });
												setSelectedReward(reward);
											}}>
											{reward}
										</a>
									</li>
								))}
							</ul>
						</div>{" "}
						<button onClick={() => addTask()} className={styles.confirmButton}>
							Potvrdiť
						</button>
					</div>
					<div className={styles.tasksContainer}>
						{Object.keys(tasks).map((userName, index) => (
							<div key={index} className={styles.userSection}>
								<h4>{userName}</h4>
								<div className={styles.taskList}>
									{tasks[userName].map((task, taskIndex) => (
										<span
											key={taskIndex}
											className={styles.taskBox}
											style={{ backgroundColor: task.color }}
											onMouseEnter={() => showTooltip(task)}
											onMouseLeave={hideTooltip}>
											{task.task}
											{tooltip.visible && tooltip.taskInfo === task && (
												<div className={styles.tooltip}>
													<p>Od: {task.startDate}</p>
													<p>Do: {task.endDate}</p>
													<p>Odmena: {task.reward}</p>
													<button onClick={() => removeTask(userName, taskIndex)} className={styles.removeButton}>
														Zrušiť
													</button>
												</div>
											)}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ParentAddTask;
