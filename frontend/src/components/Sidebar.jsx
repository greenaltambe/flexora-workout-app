import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	MdDashboard,
	MdHistory,
	MdLeaderboard,
	MdLogout,
	MdClose,
	MdPerson,
} from "react-icons/md";
import useUserStore from "../store/userStore";
import api from "../lib/api";

const Sidebar = ({ isOpen, onClose }) => {
	const navigate = useNavigate();
	const { user, logoutUser } = useUserStore();

	const handleLogout = async () => {
		try {
			await api.get("/auth/logout");
			logoutUser();
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const navLinks = [
		{ to: "/dashboard", icon: MdDashboard, label: "Dashboard" },
		{ to: "/history", icon: MdHistory, label: "History" },
		{ to: "/leaderboard", icon: MdLeaderboard, label: "Leaderboard" },
	];

	const sidebarContent = (
		<div className="h-full flex flex-col bg-card">
			{/* Close button for mobile */}
			<div className="lg:hidden flex justify-end p-4">
				<button
					onClick={onClose}
					className="text-text-secondary hover:text-text-primary transition-colors"
				>
					<MdClose size={24} />
				</button>
			</div>

			{/* Logo/Brand */}
			<div className="px-6 py-8">
				<h1 className="text-2xl font-bold text-primary">Flexora</h1>
			</div>

			{/* Navigation Links */}
			<nav className="flex-1 px-4 space-y-2">
				{navLinks.map((link) => (
					<NavLink
						key={link.to}
						to={link.to}
						onClick={() => onClose()}
						className={({ isActive }) =>
							`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
								isActive
									? "bg-primary text-white"
									: "text-text-secondary hover:bg-gray-800 hover:text-text-primary"
							}`
						}
					>
						<link.icon size={24} />
						<span className="font-medium">{link.label}</span>
					</NavLink>
				))}
			</nav>

			{/* User Profile & Logout */}
			<div className="p-4 border-t border-gray-800">
				{user && (
					<div className="flex items-center gap-3 px-2 py-3">
						<img
							src={user.profileImage || "/default-avatar.png"}
							alt={user.displayName}
							className="w-10 h-10 rounded-full object-cover"
						/>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-text-primary truncate">
								{user.displayName}
							</p>
							<p className="text-xs text-text-secondary truncate">
								{user.email}
							</p>
						</div>
					</div>
				)}
				<div className="mt-2 space-y-2">
					<NavLink
						to="/profile"
						onClick={() => onClose()}
						className={({ isActive }) =>
							`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
								isActive
									? "bg-primary text-white"
									: "text-text-secondary hover:bg-gray-800 hover:text-text-primary"
							}`
						}
					>
						<MdPerson size={20} />
						<span className="font-medium">Profile</span>
					</NavLink>
					<button
						onClick={handleLogout}
						className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors"
					>
						<MdLogout size={24} />
						<span className="font-medium">Logout</span>
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<>
			{/* Desktop Sidebar - Always visible */}
			<div className="hidden lg:block w-64 h-screen sticky top-0">
				{sidebarContent}
			</div>

			{/* Mobile Sidebar - Slide in from left */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={onClose}
							className="lg:hidden fixed inset-0 bg-black/50 z-40"
						/>

						{/* Sidebar */}
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{
								type: "spring",
								damping: 30,
								stiffness: 300,
							}}
							className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50"
						>
							{sidebarContent}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default Sidebar;
