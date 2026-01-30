export class DayResponseDto {
  id: string;
  date: string;

  total: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };

  weight?: number;
}
