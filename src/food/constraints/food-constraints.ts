export const FoodConstraints = {
  title: {
    minLength: 1,
    maxLength: 250,
  },

  weight: {
    min: 1,
    max: 5000,
  },

  calories: {
    min: 0,
    max: 5000,
  },

  protein: {
    min: 0,
    max: 500,
  },

  fat: {
    min: 0,
    max: 500,
  },

  carbs: {
    min: 0,
    max: 600,
  },
} as const;
