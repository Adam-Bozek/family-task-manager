import React, { useState } from 'react';
import styles from './css/ParentAddTask.module.css';

const ParentAddTask = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    name: '',
    task: '',
    from: '',
    to: '',
    reward: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const addTask = () => {
    setTasks((prevTasks) => {
      const existingUserIndex = prevTasks.findIndex((t) => t.name === taskData.name);
      if (existingUserIndex !== -1) {
        const updatedTasks = [...prevTasks];
        updatedTasks[existingUserIndex].tasks.push({
          task: taskData.task,
          color: getRandomColor(),
        });
        return updatedTasks;
      } else {
        return [
          ...prevTasks,
          {
            name: taskData.name,
            tasks: [
              {
                task: taskData.task,
                color: getRandomColor(),
              },
            ],
          },
        ];
      }
    });
    setTaskData({ name: '', task: '', from: '', to: '', reward: '' });
  };

  const getRandomColor = () => {
    const colors = ['#4CAF50', '#FF5722', '#03A9F4', '#FFC107'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className={styles.pageContainer}>
<div className={styles.buttonFrame}>
  <button className={styles.backButton}>Domov</button>
  <button className={styles.settingsButton}>Nastavenia</button>
  <button className={styles.settingsButton}>Zadať úlohu</button>
  <button className={styles.logoutButton}>Odhlásiť sa</button>
</div>
      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <h3>Zadanie Úloh</h3>
          <input
            name="name"
            placeholder="Meno"
            value={taskData.name}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            name="task"
            placeholder="Úloha"
            value={taskData.task}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            name="from"
            placeholder="Od (dd. mm. rrrr)"
            value={taskData.from}
            onChange={handleInputChange}
            className={styles.input}
            type="date"
          />
          <input
            name="to"
            placeholder="Do (dd. mm. rrrr)"
            value={taskData.to}
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
          {tasks.map((user, index) => (
            <div key={index} className={styles.userSection}>
              <h4>{user.name}</h4>
              <div className={styles.taskList}>
                {user.tasks.map((task, taskIndex) => (
                  <span
                    key={taskIndex}
                    className={styles.taskBox}
                    style={{ backgroundColor: task.color }}
                  >
                    {task.task}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentAddTask;
