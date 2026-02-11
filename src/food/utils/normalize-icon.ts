import { FoodIcon } from '../enums';

export const normalizeIcon = (icon: unknown): FoodIcon => {
  if (Object.values(FoodIcon).includes(icon as FoodIcon)) {
    return icon as FoodIcon;
  }

  return FoodIcon.Other;
};
