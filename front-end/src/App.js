import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/utilities/ProtectedRoute";

// Public routes
import Home from "./components/LandingPage";
import MoreInfo from "./components/MoreInfo";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";

// Protected routes (only accessible after login)
import AfterRegistration from "./components/AfterRegistration";

import ParentDashboardTasks from "./components/ParentDashboardTasks";
import ParentDashboardRewards from "./components/ParentDashboardRewards";
import ParentSettings from "./components/ParentSettings";
import ParentAddTask from "./components/ParentAddTask";

// Template component
import TEMPLATE from "./components/TEMPLATE";

const App = () => {
	return (
		<Routes>
			{/* Public routes */}
			<Route path="/Home" element={<Home />} />
			<Route path="/MoreInfo" element={<MoreInfo />} />
			<Route path="/Register" element={<RegistrationPage />} />
			<Route path="/LogIn" element={<LoginPage />} />

			{/* Testing routes */}
			<Route path="/test_parent_dashboard_tasks" element={<ParentDashboardTasks />} />
			<Route path="/test_parent_dashboard_rewards" element={<ParentDashboardRewards />} />
			<Route path="/test_parent_settings" element={<ParentSettings />} />
			<Route path="/test_parent_add_task" element={<ParentAddTask />} />
			<Route path="/test_template" element={<TEMPLATE />} />

			{/* Routes only accessible after registration */}
			<Route path="/AfterRegistration" element={<ProtectedRoute element={<AfterRegistration />} allowedRoles={["after-reg"]} />} />{" "}
			
			{/* TODO: Implement this: Routes only for parents */}
			<Route path="/MoreInfo" element={<ProtectedRoute element={<MoreInfo />} allowedRoles={["parent"]} />} />
			
			{/* TODO: Implement this: Routes only for kids */}
			<Route path="/Login" element={<ProtectedRoute element={<LoginPage />} allowedRoles={["kid"]} />} />
			
			{/* Catch-all redirect */}
			<Route path="*" element={<Navigate replace to="/Home" />} />
		</Routes>
	);
};

export default App;
