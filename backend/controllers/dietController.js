import axios from "axios";
import { getMacroTargets } from "../data/dietKnowledgeBase.js";

// Get diet suggestions with recipes from Spoonacular
const getDietSuggestion = async (req, res) => {
	try {
		const { diet_type, meal_type } = req.body;

		// Validate input
		if (!diet_type || !meal_type) {
			return res.status(400).json({
				error: "Missing required fields",
				message: "Please provide both diet_type and meal_type",
			});
		}

		// Step A: Get macro targets from knowledge base
		const macroTargets = getMacroTargets(diet_type, meal_type);

		if (!macroTargets) {
			return res.status(404).json({
				error: "Diet combination not found",
				message: `No macro targets found for diet type "${diet_type}" and meal type "${meal_type}"`,
			});
		}

		console.log(
			`📊 Macro targets for ${diet_type} ${meal_type}:`,
			macroTargets
		);

		// Step B: Call Spoonacular API
		try {
			const spoonacularUrl =
				"https://api.spoonacular.com/recipes/findByNutrients";
			const params = {
				apiKey: process.env.SPOONACULAR_API_KEY,
				maxCalories: macroTargets.calories,
				maxCarbs: macroTargets.carbs,
				maxProtein: macroTargets.proteins,
				maxFat: macroTargets.fats,
				number: 3,
			};

			console.log("🍽️  Calling Spoonacular API with params:", params);

			const response = await axios.get(spoonacularUrl, { params });

			// Step C: Format the final response
			const recipes = response.data.map((recipe) => ({
				id: recipe.id,
				title: recipe.title,
				image: recipe.image,
			}));

			console.log(
				`✅ Retrieved ${recipes.length} recipes from Spoonacular`
			);

			res.json({
				success: true,
				macro_targets: {
					calories: macroTargets.calories,
					carbs: macroTargets.carbs,
					proteins: macroTargets.proteins,
					fats: macroTargets.fats,
				},
				recipes: recipes,
			});
		} catch (spoonacularError) {
			console.error(
				"❌ Spoonacular API error:",
				spoonacularError.message
			);

			// Check if it's a rate limit or API key issue
			if (spoonacularError.response) {
				console.error(
					"Response status:",
					spoonacularError.response.status
				);
				console.error("Response data:", spoonacularError.response.data);
			}

			return res.status(503).json({
				error: "Recipe service unavailable",
				message: "Could not fetch recipe suggestions at this time.",
			});
		}
	} catch (error) {
		console.error("❌ Error getting diet suggestions:", error.message);
		res.status(500).json({
			error: "Failed to get diet suggestions",
			message: error.message,
		});
	}
};

export { getDietSuggestion };
