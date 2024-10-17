import React, { createContext, useState } from "react";

// Creating context "global variables"
export const AppContext = createContext();

// Provider component that provides the context
export const AppProvider = ({ children }) => {
  // Variables for user interaction
	const [email, setStateEmail] = useState("");
	const [role, setStateRole] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Setter function for role
	const setRole = (role) => {
		if (role === "parent" || role === "kid" || role === "after-reg") {
			setStateRole(role);
		} else {
			console.error('Invalid role.');
		}
	};

  // Setter function for email
  const setEmail = (newEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(newEmail)) {
      setStateEmail(newEmail);
    } else {
      console.error('Invalid email format.');
    }
  };

	return( 
    <AppContext.Provider value={{ email, role, isLoggedIn, setEmail, setRole, setIsLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
};
