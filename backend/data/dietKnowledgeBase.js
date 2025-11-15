// Diet Knowledge Base - Macro targets for different diet and meal types
export const dietKnowledgeBase = [
	// Standard Diet
	{
		diet_type: "standard",
		meal_type: "breakfast",
		calories: 450,
		carbs: 50,
		proteins: 20,
		fats: 15,
	},
	{
		diet_type: "standard",
		meal_type: "lunch",
		calories: 600,
		carbs: 70,
		proteins: 35,
		fats: 20,
	},
	{
		diet_type: "standard",
		meal_type: "dinner",
		calories: 550,
		carbs: 60,
		proteins: 30,
		fats: 18,
	},

	// Keto Diet
	{
		diet_type: "keto",
		meal_type: "breakfast",
		calories: 500,
		carbs: 10,
		proteins: 30,
		fats: 40,
	},
	{
		diet_type: "keto",
		meal_type: "lunch",
		calories: 650,
		carbs: 15,
		proteins: 45,
		fats: 50,
	},
	{
		diet_type: "keto",
		meal_type: "dinner",
		calories: 550,
		carbs: 10,
		proteins: 40,
		fats: 45,
	},

	// Paleo Diet
	{
		diet_type: "paleo",
		meal_type: "breakfast",
		calories: 480,
		carbs: 40,
		proteins: 30,
		fats: 22,
	},
	{
		diet_type: "paleo",
		meal_type: "lunch",
		calories: 620,
		carbs: 50,
		proteins: 40,
		fats: 28,
	},
	{
		diet_type: "paleo",
		meal_type: "dinner",
		calories: 570,
		carbs: 45,
		proteins: 38,
		fats: 25,
	},

	// Vegetarian Diet
	{
		diet_type: "vegetarian",
		meal_type: "breakfast",
		calories: 420,
		carbs: 55,
		proteins: 18,
		fats: 12,
	},
	{
		diet_type: "vegetarian",
		meal_type: "lunch",
		calories: 580,
		carbs: 75,
		proteins: 25,
		fats: 15,
	},
	{
		diet_type: "vegetarian",
		meal_type: "dinner",
		calories: 530,
		carbs: 68,
		proteins: 22,
		fats: 14,
	},

	// Vegan Diet
	{
		diet_type: "vegan",
		meal_type: "breakfast",
		calories: 400,
		carbs: 60,
		proteins: 15,
		fats: 10,
	},
	{
		diet_type: "vegan",
		meal_type: "lunch",
		calories: 560,
		carbs: 80,
		proteins: 20,
		fats: 12,
	},
	{
		diet_type: "vegan",
		meal_type: "dinner",
		calories: 510,
		carbs: 72,
		proteins: 18,
		fats: 11,
	},

	// Mediterranean Diet
	{
		diet_type: "mediterranean",
		meal_type: "breakfast",
		calories: 460,
		carbs: 48,
		proteins: 22,
		fats: 18,
	},
	{
		diet_type: "mediterranean",
		meal_type: "lunch",
		calories: 610,
		carbs: 65,
		proteins: 32,
		fats: 24,
	},
	{
		diet_type: "mediterranean",
		meal_type: "dinner",
		calories: 560,
		carbs: 58,
		proteins: 30,
		fats: 22,
	},

	// Other/Balanced Diet
	{
		diet_type: "other",
		meal_type: "breakfast",
		calories: 450,
		carbs: 52,
		proteins: 20,
		fats: 15,
	},
	{
		diet_type: "other",
		meal_type: "lunch",
		calories: 600,
		carbs: 68,
		proteins: 30,
		fats: 20,
	},
	{
		diet_type: "other",
		meal_type: "dinner",
		calories: 550,
		carbs: 62,
		proteins: 28,
		fats: 18,
	},
];

// Helper function to get macro targets for a specific diet and meal type
export const getMacroTargets = (dietType, mealType) => {
	const normalizedDietType = dietType.toLowerCase();
	const normalizedMealType = mealType.toLowerCase();

	const result = dietKnowledgeBase.find(
		(entry) =>
			entry.diet_type === normalizedDietType &&
			entry.meal_type === normalizedMealType
	);

	return result || null;
};
