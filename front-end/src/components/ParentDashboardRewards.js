import React from 'react';
import styles from './css/ParentDashboardRewards.module.css';

const ParentDashboardRewards = ({ rewards }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.buttonFrame}>
        <button className={styles.backButton}>Domov</button>
        <button className={styles.settingsButton}>Nastavenia</button>
        <button className={styles.taskButton}>Zadať úlohu</button>
        <button className={styles.logoutButton}>Odhlásiť sa</button>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.tabs}>
          <button className={styles.tabInactive}>Úlohy</button>
          <button className={styles.tabActive}>Vybrané odmeny</button>
        </div>
        <h3>Úlohy na splnenie dnes</h3>
        <div className={styles.rewardTable}>
          {rewards.map((user, index) => (
            <div key={index} className={styles.userRow}>
              <span className={styles.userName}>{user.name}</span>
              <div className={styles.rewardList}>
                {user.rewards.map((reward, rewardIndex) => (
                  <span
                    key={rewardIndex}
                    className={styles.rewardBox}
                    style={{ backgroundColor: reward.status === 'completed' ? '#4CAF50' : '#FFC107' }}
                  >
                    {reward.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={styles.completed}></span> Splnené</span>
          <span className={styles.legendItem}><span className={styles.pending}></span> Čakajúce na splnenie</span>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardRewards;
