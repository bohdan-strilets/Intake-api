export const FOOD_LIST_SORT_FIELDS = ['weight', 'calories', 'protein', 'carbs', 'fat'] as const;
export type FoodListSortField = (typeof FOOD_LIST_SORT_FIELDS)[number];

export const FOOD_LIST_SORT_ORDERS = ['asc', 'desc'] as const;
export type FoodListSortOrder = (typeof FOOD_LIST_SORT_ORDERS)[number];

export type ListFoodOptions = {
  sortBy?: FoodListSortField;
  sortOrder?: FoodListSortOrder;
  search?: string;
};
