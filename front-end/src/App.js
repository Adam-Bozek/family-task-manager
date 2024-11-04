// App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/LandingPage";
import MoreInfo from "./components/MoreInfo";
import RegistrationPage from "./components/RegistrationPage";
import AfterRegistration from "./components/AfterRegistration";
import LoginPage from "./components/LoginPage";
import ParentAddTask from "./components/ParentAddTask";

import TEMPLATE from "./components/TEMPLATE"; // This is a placeholder for your template component. Replace it with your actual component.

import ProtectedRoute from "./components/utilities/ProtectedRoute"; // Import the ProtectedRoute

const App = () => {
	return (
		<Routes>
			{/* Public routes */}
			<Route path="/Home" element={<Home />} />
			<Route path="/MoreInfo" element={<MoreInfo />} />
			<Route path="/Register" element={<RegistrationPage />} />
			<Route path="/LogIn" element={<LoginPage />} />
			<Route path="/TEST" element={<TEMPLATE />} />
			<Route path="/ParentAddTask" element={<ParentAddTask />} />
			
			

			{/* Routes only accessible after registration */}
			<Route path="/AfterRegistration" element={<ProtectedRoute element={<AfterRegistration />} allowedRoles={["after-reg"]} />} /> {/*Maybe hash this role or use soe string that seems hashed*/}

			{/* Routes only for parents */}
			<Route path="/MoreInfo" element={<ProtectedRoute element={<MoreInfo />} allowedRoles={["parent"]} />} />

			{/* Routes only for kids */}
			<Route path="/Login" element={<ProtectedRoute element={<LoginPage />} allowedRoles={["kid"]} />} />

			{/* Catch-all redirect */}
			<Route path="*" element={<Navigate replace to="/Home" />} />
		</Routes>
	);
};

export default App;
