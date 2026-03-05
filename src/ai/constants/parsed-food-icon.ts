

export const PARSED_FOOD_ICON_VALUES = [
  'meat',
  'fish',
  'egg',
  'dairy',
  'protein',
  'vegetable',
  'fruit',
  'legume',
  'nut',
  'grain',
  'sauce',
  'sweet',
  'snack',
  'fast_food',
  'drink',
  'mixed_dish',
  'other',
] as const;

export type ParsedFoodIcon = (typeof PARSED_FOOD_ICON_VALUES)[number];