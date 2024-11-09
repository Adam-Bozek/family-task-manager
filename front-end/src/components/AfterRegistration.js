import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./css/AfterRegistrationPage.module.css"; // Import CSS module

import { addToFamily, familyCreation } from "./utilities/Utils";
import {AppContext} from "./utilities/AppContext";

const AfterRegistration = () => {
  const [familyName, setFamilyName] = useState('');//Set family name
  const [familyCode, setFamilyCode] = useState('');

  const { email , setRole, } = useContext(AppContext);
  
  const navigate = useNavigate(); 

  const handleFamilyCreation = () => {

    if (familyCreation(familyName, email)){
      setRole("parent");
      navigate("/ParentDashboardTasks");
    }
  };

  const handleJoinFamily = async () => {
    try {
      // Call addToFamily and await its result
      const result = await addToFamily(familyCode, email);
  
      // Check the success status from the result
      if (result.success) {
        if (result.role) {
          // Set role and navigate based on the returned role
          if (result.role === "parent") {
            setRole("parent");
            navigate("/ParentDashboardTasks");
          } else if (result.role === "kid") {
            setRole("kid");
            navigate("/MoreInfo");
          }
        } else {
          console.log("No role returned.");
          // Handle case where role is undefined or null
        }
      } else {
        console.log("Failed to add to family:", result.message);
        // Handle failure case, e.g., show an error message to the user
        alert(result.message || "Failed to join family. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleJoinFamily:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.afterRegistrationContainer}>
    <div className={styles.blurredBannerContainer}>
      <h1 className={styles.title}>A je to!</h1>
      <p className={styles.description}>
        Ste prihlásený, ale prvým krokom je vytvorenie si rodiny alebo prihlásenie sa do už existujúcej
      </p>
      
      <div className={styles.formContainer}>
        <div className={styles.joinFamilySection}>
          <p className={styles.instructions}>Ak už máte kľúč na pridanie sa do rodiny tak ho zadajte sem.</p>
          <input
            type="text"
            placeholder="Kód"
            value={familyCode}
            onChange={(e) => setFamilyCode(e.target.value)}
            className={styles.inputField}
          />
          <button className={styles.actionButton} onClick={handleJoinFamily}>
            Pridať sa k rodine
          </button>
        </div>
  
        <div className={styles.createFamilySection}>
          <p className={styles.instructions}>Ak nemáte ešte rodinu tak si ju vytvorte.</p>
          <input
            type="text"
            placeholder="Názov rodiny"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className={styles.inputField}
          />
          <button className={styles.actionButton} onClick={handleFamilyCreation}>
            Vytvoriť rodinu
          </button>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default AfterRegistration;
