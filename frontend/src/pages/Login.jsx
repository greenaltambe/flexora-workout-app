import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { MdFitnessCenter } from "react-icons/md";

const Login = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card p-4 overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<motion.div
					className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.5, 0.3, 0.5],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1,
					}}
				/>
			</div>

			{/* Main content */}
			<div className="w-full max-w-md relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="text-center mb-12"
				>
					{/* Logo with icon */}
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="flex items-center justify-center gap-3 mb-4"
					>
						<motion.div
							animate={{
								rotate: [0, 10, -10, 0],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<MdFitnessCenter
								className="text-primary"
								size={48}
							/>
						</motion.div>
						<h1 className="text-5xl font-bold text-white">
							Flex<span className="text-primary">ora</span>
						</h1>
					</motion.div>

					{/* Tagline */}
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="text-lg text-text-secondary font-light"
					>
						Your Personalized Fitness Journey Awaits
					</motion.p>
				</motion.div>

				{/* Login card */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-800"
				>
					{/* Google Sign In Button */}
					<motion.a
						href="http://localhost:8080/auth/google"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
					>
						<FcGoogle size={24} />
						<span>Sign in with Google</span>
						<motion.span
							initial={{ x: 0 }}
							whileHover={{ x: 5 }}
							className="ml-2 text-gray-600 group-hover:text-gray-800 transition-colors"
						>
							→
						</motion.span>
					</motion.a>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-800"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-card text-text-secondary">
								Quick & Secure
							</span>
						</div>
					</div>

					{/* Features */}
					<div className="space-y-3 text-sm text-text-secondary">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.8 }}
							className="flex items-center gap-2"
						>
							<div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
							<span>Personalized workout recommendations</span>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.9 }}
							className="flex items-center gap-2"
						>
							<div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
							<span>AI-powered meal planning</span>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 1.0 }}
							className="flex items-center gap-2"
						>
							<div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
							<span>Track your progress & compete</span>
						</motion.div>
					</div>

					{/* Terms */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1.2 }}
						className="text-xs text-text-secondary text-center mt-8"
					>
						By continuing, you agree to our{" "}
						<span className="text-primary hover:underline cursor-pointer">
							Terms of Service
						</span>{" "}
						and{" "}
						<span className="text-primary hover:underline cursor-pointer">
							Privacy Policy
						</span>
					</motion.p>
				</motion.div>

				{/* Footer */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.4 }}
					className="text-center mt-8 text-sm text-text-secondary"
				>
					<p>Made with 💪 for fitness enthusiasts</p>
				</motion.div>
			</div>
		</div>
	);
};

export default Login;
