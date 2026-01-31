import { PipelineStage, Types } from 'mongoose';

export const buildDayTotalsPipeline = (dayId: Types.ObjectId): PipelineStage[] => [
  { $match: { dayId } },
  {
    $group: {
      _id: null,
      calories: { $sum: '$calories' },
      protein: { $sum: '$protein' },
      fat: { $sum: '$fat' },
      carbs: { $sum: '$carbs' },
    },
  },
];
