import { useState } from "react";
import { Outlet } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import Sidebar from "./Sidebar";

const Layout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex min-h-screen bg-background">
			{/* Sidebar */}
			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col">
				{/* Top Bar for Mobile */}
				<div className="lg:hidden bg-card border-b border-gray-800 px-4 py-3 sticky top-0 z-30">
					<button
						onClick={() => setSidebarOpen(true)}
						className="text-text-secondary hover:text-text-primary transition-colors"
					>
						<MdMenu size={28} />
					</button>
				</div>

				{/* Page Content */}
				<main className="flex-1 p-4 lg:p-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;
