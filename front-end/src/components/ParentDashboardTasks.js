import React from 'react';
import styles from "./css/ParentDashboardTasks.css"; // Import CSS module

const ParentDashboardTasks = ({ familyTasks }) => {
  // Helper function to determine the color based on the task status
  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'green';
      case 'not_done':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'blue';
    }
  };

  return (
    <div className="tasks-page">
      <header>
        <button className="logout-button">Odhl�si� sa</button>
      </header>
      
      <div className="content">
        <nav>
          <button>Domov</button>
          <button>Nastavenia</button>
          <button>Zada� �lohu</button>
        </nav>
        
        <div className="tasks-section">
          <div className="tasks-header">
            <button>�lohy</button>
            <button className="disabled">Vybran� odmeny</button>
          </div>
          
          <h2>�lohy na splnenie dnes</h2>

          {/* Map through each family member's tasks */}
          <div className="tasks-list">
            {familyTasks.map((person, personIndex) => (
              <div key={personIndex} className="person-tasks">
                <h3>{person.name}</h3> {/* The name will come dynamically */}
                <div className="task-items">
                  {person.tasks.map((task, taskIndex) => (
                    <button
                      key={taskIndex}
                      className="task-item"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {task.task}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <footer className="legend">
          <div className="legend-item"><span className="dot green"></span> Splnen�</div>
          <div className="legend-item"><span className="dot red"></span> Nesplnen�</div>
          <div className="legend-item"><span className="dot orange"></span> �ak� na potvrdenie</div>
          <div className="legend-item"><span className="dot blue"></span> Zatia� neuroben�</div>
        </footer>
      </div>
    </div>
  );
};

export default ParentDashboardTasks;
// JavaScript Document
