import React, { createContext, useState } from "react";

// Creating context "global variables"
export const AppContext = createContext();

// Provider component that provides the context
export const AppProvider = ({ children }) => {
  // Variables for user interaction
  const [name, setStateName] = useState("");
	const [email, setStateEmail] = useState("");
	const [role, setStateRole] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Setter function for role
	const setRole = (role) => {
		if (role === "parent" || role === "kid" || role === "after-reg" || role === null) {
			setStateRole(role);
		} else {
			console.error('Invalid role.');
		}
	};

  // Setter function for email
  const setEmail = (newEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(newEmail) || newEmail === null) {
      setStateEmail(newEmail);
    } else {
      console.error('Invalid email format.');
    }
  };

  // Setter function for name
  const setName = (newName) => {
    if (newName.length >= 2 && newName.length <= 50 || newName == null) {
      setStateName(newName);
    } else {
      console.error('Invalid name format.');
    }
  };

	return( 
    <AppContext.Provider value={{ name, email, role, isLoggedIn, setName, setEmail, setRole, setIsLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
};
