const Dashboard = () => {
	return (
		<div className="max-w-7xl mx-auto">
			<h1 className="text-3xl font-bold text-text-primary mb-6">
				Dashboard
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="bg-card rounded-lg p-6">
					<h3 className="text-xl font-semibold text-primary mb-2">
						Welcome!
					</h3>
					<p className="text-text-secondary">
						Your personalized fitness dashboard is ready.
					</p>
				</div>
				<div className="bg-card rounded-lg p-6">
					<h3 className="text-xl font-semibold text-text-primary mb-2">
						Quick Stats
					</h3>
					<p className="text-text-secondary">
						Stats will appear here.
					</p>
				</div>
				<div className="bg-card rounded-lg p-6">
					<h3 className="text-xl font-semibold text-text-primary mb-2">
						Today's Goal
					</h3>
					<p className="text-text-secondary">Your goals for today.</p>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
