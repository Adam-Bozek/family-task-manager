import React, { useState } from 'react';
import styles from './css/ParentAddTask.module.css';
import { useNavigate } from "react-router-dom";

const ParentAddTask = () => {
  const [tasks, setTasks] = useState({}); // Object for storing tasks by user
  const [taskData, setTaskData] = useState({
    name: '',
    task: '',
    startDate: '',
    endDate: '',
    reward: ''
  });
  const [tooltip, setTooltip] = useState({ visible: false, taskInfo: null });

  const handleInputChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (taskData.name && taskData.task) {
      setTasks((prevTasks) => {
        const userTasks = prevTasks[taskData.name] || [];
        return {
          ...prevTasks,
          [taskData.name]: [
            ...userTasks,
            { ...taskData, color: getRandomColor() } // Include all task data
          ]
        };
      });
      setTaskData({ name: '', task: '', startDate: '', endDate: '', reward: '' }); // Reset input fields
    }
  };


  const removeTask = (userName, taskIndex) => {
    setTasks((prevTasks) => {
      const userTasks = [...prevTasks[userName]];
      userTasks.splice(taskIndex, 1); // Remove task at taskIndex
      // If no tasks left for the user, remove the user from tasks
      if (userTasks.length === 0) {
        const { [userName]: _, ...rest } = prevTasks; // Remove user from the object
        return rest;
      }
      return { ...prevTasks, [userName]: userTasks };
    });
    setTooltip({ visible: false, taskInfo: null }); // Hide tooltip
  };

  const showTooltip = (task) => {
    setTooltip({ visible: true, taskInfo: task });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, taskInfo: null });
  };

  // Predefined color palette for better text visibility
  const colorPalette = [
    '#FF5733', '#33FF57', '#3357FF', '#F1C40F',
    '#8E44AD', '#E67E22', '#1ABC9C', '#D35400',
    '#2C3E50', '#C0392B'
  ];

  const getRandomColor = () => {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)];
  };

  const navigate = useNavigate();
  // Navigacia
  const handle_redirect = (route) => {
		navigate(route);
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
                  <li className="nav-item ">
                    <button className={`nav-link ${styles["nav-font-weight"]} `} onClick={ () => handle_redirect("/ParentDashboardTasks")}>
                      Domov
                    </button>
                  </li>
                  <li className="nav-item mx-4">
                    <button className={`nav-link ${styles["nav-font-weight"]}`} onClick={ () => handle_redirect("/ParentSettings")}>
                      Nastavenia
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${styles["nav-font-weight"]} active`} aria-current="page" onClick={ () => handle_redirect("/ParentTasks")}>
                      Zadať úlohu
                    </button>
                  </li>
                </ul>
                <div className="d-lg-flex col-lg-3 justify-content-lg-end">
                  <button className={`btn btn-dark ${styles["nav-button-weight"]} rounded-4 my-1`}>Odhlásiť sa</button>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className={styles.mainContainer}>
          <div className={styles.formContainer}>
            <h3>Zadanie Úloh</h3>
            <input
              name="name"
              placeholder="Meno"
              value={taskData.name}
              onChange={handleInputChange}
              className={styles.input}
              list="namesList" // Link input to datalist
            />
            <datalist id="namesList">
              {Object.keys(tasks).map((userName, index) => (
                <option key={index} value={userName} />
              ))}
            </datalist>
            <input
              name="task"
              placeholder="Úloha"
              value={taskData.task}
              onChange={handleInputChange}
              className={styles.input}
            />
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
            <input
              name="reward"
              placeholder="Odmena"
              value={taskData.reward}
              onChange={handleInputChange}
              className={styles.input}
            />
            <button onClick={addTask} className={styles.confirmButton}>Potvrdiť</button>
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
                      onMouseLeave={hideTooltip}
                    >
                      {task.task}
                      {tooltip.visible && tooltip.taskInfo === task && (
                        <div className={styles.tooltip}>
                          <p>Od: {task.startDate}</p>
                          <p>Do: {task.endDate}</p>
                          <p>Odmena: {task.reward}</p>
                          <button onClick={() => removeTask(userName, taskIndex)} className={styles.removeButton}>Zrušiť</button>
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
