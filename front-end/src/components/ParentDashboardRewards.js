import React, { useState } from 'react'; 
import styles from './css/ParentDashboardRewards.module.css';
import { useNavigate } from "react-router-dom";

const ParentDashboardTasks = () => {
  // State to manage rewards for each child, with each child having their own list of rewards
  const [tasks, setTasks] = useState({
    Adam: ['Candy', '5€'], 
    Janko: ['20 minutes of PC time'], 
    Marta: ['10€'],
  });

  // Function to add a new reward to a specific child's list
  const addTask = (name, newTask) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [name]: [...prevTasks[name], newTask], // Append new reward to the existing list of the child
    }));
  };

  // Example usage of addTask function (can be triggered with user input)
  // addTask('Adam', 'New reward for Adam');

  const navigate = useNavigate();
  const handle_redirect = (route) => {
		navigate(route);
	};

  return (
    <>
      <div className={styles["templateMain"]}>
        <div className={styles["blur-container"]}>
          {/* Header with navigation */}
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

                {/* Navbar items and links */}
                <div className="collapse navbar-collapse d-lg-flex" id="navbarsExample11">
                  <span className="navbar-brand col-lg-3 me-0" />
                  <ul className="navbar-nav col-lg-6 justify-content-lg-center">
                    <li className="nav-item ">
                      <button className={`nav-link ${styles["nav-font-weight"]} active`} aria-current="page" onClick={ () => handle_redirect("/ParentDashboardTasks")}>
                        Home
                      </button>
                    </li>
                    <li className="nav-item mx-4">
                      <button className={`nav-link ${styles["nav-font-weight"]}`} onClick={ () => handle_redirect("/ParentSettings")}>
                        Settings
                      </button>
                    </li>
                    <li className="nav-item">
                      <button className={`nav-link ${styles["nav-font-weight"]}`}  onClick={ () => handle_redirect("/ParentTasks")}>
                        Assign Task
                      </button>
                    </li>
                  </ul>
                  <div className="d-lg-flex col-lg-3 justify-content-lg-end">
                    <button className={`btn btn-dark ${styles["nav-button-weight"]} rounded-4 my-1`}>Logout</button>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          
          {/* Main content area for displaying rewards */}
          <div className={styles.mainContainer}>
            <div className={styles.formContainer}>
              {/* Buttons for navigating to tasks and rewards sections */}
              <button className={` ${styles["buttonTask"]} my-1`} onClick={ () => handle_redirect("/ParentDashboardTasks")}>Tasks</button>
              <button className={` ${styles["buttonReward"]} my-1`} onClick={ () => handle_redirect("/ParentDashboardRewards")}>Selected Rewards</button>
            </div>

            <h3>Tasks to Complete Today</h3>
            <div className={styles.tasksContainer}>
              {/* Display each child's name and list of rewards */}
              {Object.entries(tasks).map(([name, taskList]) => (
                <div key={name} className={styles.userTaskGroup}>
                  <div className={styles.userSection}>
                    <span className={styles.userName}>{name}</span>
                    <div className={styles.taskList}>
                      {taskList.map((task, index) => (
                        <span key={index} className={styles.taskItem}>{task}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
           
            {/* Legend to describe the status of rewards */}
            <div className={styles.legendContainer}>
              <div className={styles.legend}>
                <span className={styles.legendItem}><span className={styles.completed}></span> Completed</span>
                <span className={styles.legendItem}><span className={styles.pending}></span> Pending Completion</span>
              </div>
            </div>
            </div>
            </div>
            </div>
            </div>
    </>
  );
};

export default ParentDashboardTasks;
