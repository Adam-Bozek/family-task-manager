import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/utilities/ProtectedRoute";

// Public routes
import Home from "./components/LandingPage";
import MoreInfo from "./components/MoreInfo";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";

// Protected routes (only accessible after login)
import AfterRegistration from "./components/utilities/AfterRegistration";

import ParentDashboardTasks from "./components/parent/ParentDashboardTasks";
import ParentDashboardRewards from "./components/parent/ParentDashboardRewards";
import ParentSettings from "./components/parent/ParentSettings";
import ParentAddTask from "./components/parent/ParentAddTask";

import KidRewardExchange from "./components/kid/KidRewardExchange";
import KidDashboard from "./components/kid/KidDashboard";

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
			<Route path="/test_template" element={<TEMPLATE />} />

			{/* Routes only accessible after registration */}
			<Route path="/AfterRegistration" element={<ProtectedRoute element={<AfterRegistration />} allowedRoles={["after-reg"]} />} />

			{/* Routes only for parents */}
			<Route path="/ParentDashboardTasks" element={<ProtectedRoute element={<ParentDashboardTasks />} allowedRoles={["parent"]} />} />
			<Route path="/ParentDashboardRewards" element={<ProtectedRoute element={<ParentDashboardRewards />} allowedRoles={["parent"]} />} />
			<Route path="/ParentSettings" element={<ProtectedRoute element={<ParentSettings />} allowedRoles={["parent"]} />} />
			<Route path="/ParentTasks" element={<ProtectedRoute element={<ParentAddTask />} allowedRoles={["parent"]} />} />

			{/* Routes only for kids */}

			<Route path="/KidRewardExchange" element={<ProtectedRoute element={<KidRewardExchange />} allowedRoles={["kid"]} />} />
			<Route path="/KidDashboard" element={<ProtectedRoute element={<KidDashboard />} allowedRoles={["kid"]} />} />

			{/* Catch-all redirect */}
			<Route path="*" element={<Navigate replace to="/Home" />} />
		</Routes>
	);
};

export default App;
