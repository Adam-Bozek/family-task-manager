import React from 'react';
import styles from './css/ParentDashboardTasks.module.css';

const ParentDashboardTasks = ({ tasks }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.tableContainer}>
        <h3>Úlohy na splnenie dnes</h3>
        <div className={styles.tableHeader}>
          <span>Meno</span>
          <span>Úlohy</span>
        </div>
        {tasks.map((user, index) => (
          <div key={index} className={styles.userRow}>
            <span className={styles.userName}>{user.name}</span>
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
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={styles.completed}></span> Splnené</span>
        <span className={styles.legendItem}><span className={styles.notCompleted}></span> Nesplnené</span>
        <span className={styles.legendItem}><span className={styles.pending}></span> Čaká na potvrdenie</span>
        <span className={styles.legendItem}><span className={styles.notStarted}></span> Zatiaľ neurobené</span>
      </div>
    </div>
  );
};

export default ParentDashboardTasks;
