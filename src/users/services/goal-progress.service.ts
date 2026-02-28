import { msToDays } from '@app/common/lib/date';
import { round } from '@app/common/lib/number';
import { toObjectId } from '@app/common/utils';
import { Day, DayDocument } from '@app/days/schemas';
import { Goal } from '@app/users/enums';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GoalProgressDto } from '../dto/goal-progress.dto';
import { UsersRepository } from '../users.repository';

type DayWeightRow = { date: string; weight?: number };

@Injectable()
export class GoalProgressService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectModel(Day.name)
    private readonly dayModel: Model<DayDocument>,
  ) {}

  async getGoalProgress(userId: string): Promise<GoalProgressDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      return this.emptyProgress();
    }

    const startWeight = user.weight;
    const targetWeight = user.targetWeight ?? user.weight;
    const goal = user.goal;

    const objectUserId = toObjectId(userId);
    const last14Days = await this.dayModel
      .find({ userId: objectUserId })
      .sort({ date: -1 })
      .limit(14)
      .select('date weight')
      .lean<DayWeightRow[]>()
      .exec();

    const currentWeight = this.resolveCurrentWeight(last14Days, startWeight);

    if (goal === Goal.Maintain) {
      return {
        startWeight: round(startWeight, 0),
        currentWeight: round(currentWeight, 0),
        targetWeight: round(targetWeight, 0),
        progressPercent: 1,
        kgPerWeek: null,
        estimatedWeeks: null,
      };
    }

    const progressPercent = this.calculateProgressPercent(
      goal,
      startWeight,
      currentWeight,
      targetWeight,
    );
    const kgPerWeek = this.calculateKgPerWeek(last14Days);
    const estimatedWeeks = this.calculateEstimatedWeeks(
      currentWeight,
      targetWeight,
      kgPerWeek,
      goal,
    );

    return {
      startWeight: round(startWeight, 0),
      currentWeight: round(currentWeight, 0),
      targetWeight: round(targetWeight, 0),
      progressPercent: round(progressPercent, 1),
      kgPerWeek: kgPerWeek != null ? round(kgPerWeek, 1) : null,
      estimatedWeeks: estimatedWeeks != null ? Math.ceil(estimatedWeeks) : null,
    };
  }

  private emptyProgress(): GoalProgressDto {
    return {
      startWeight: null,
      currentWeight: null,
      targetWeight: null,
      progressPercent: null,
      kgPerWeek: null,
      estimatedWeeks: null,
    };
  }

  private resolveCurrentWeight(days: DayWeightRow[], fallback: number): number {
    for (const day of days) {
      if (day.weight != null && Number.isFinite(day.weight)) {
        return day.weight;
      }
    }
    return fallback;
  }

  private calculateProgressPercent(
    goal: Goal,
    startWeight: number,
    currentWeight: number,
    targetWeight: number,
  ): number {
    if (goal === Goal.Lose) {
      const totalToLose = startWeight - targetWeight;
      if (totalToLose <= 0) return 1;
      const lost = startWeight - currentWeight;
      const progress = lost / totalToLose;
      return Math.max(0, Math.min(1, progress));
    }
    const totalToGain = targetWeight - startWeight;
    if (totalToGain <= 0) return 1;
    const gained = currentWeight - startWeight;
    const progress = gained / totalToGain;
    return Math.max(0, Math.min(1, progress));
  }

  private calculateKgPerWeek(days: DayWeightRow[]): number | null {
    const withWeight = days.filter(
      (d) => d.weight != null && Number.isFinite(d.weight),
    );
    if (withWeight.length < 2) return null;
    const byDate = [...withWeight].sort(
      (a, b) => a.date.localeCompare(b.date),
    );
    const oldest = byDate[0];
    const newest = byDate[byDate.length - 1];
    const oldestMs = new Date(oldest.date).getTime();
    const newestMs = new Date(newest.date).getTime();
    const diffMs = newestMs - oldestMs;
    const elapsedDays = msToDays(diffMs);
    const weeks = elapsedDays / 7;
    if (weeks <= 0) return null;
    const deltaKg = newest.weight! - oldest.weight!;
    return deltaKg / weeks;
  }

  private calculateEstimatedWeeks(
    currentWeight: number,
    targetWeight: number,
    kgPerWeek: number | null,
    goal: Goal,
  ): number | null {
    if (kgPerWeek == null || Math.abs(kgPerWeek) < 0.1) return null;
  
    if (
      (goal === Goal.Lose && currentWeight <= targetWeight) ||
      (goal === Goal.Gain && currentWeight >= targetWeight)
    ) {
      return 0;
    }
  
    if (
      (goal === Goal.Lose && kgPerWeek > 0) ||
      (goal === Goal.Gain && kgPerWeek < 0)
    ) {
      return null;
    }
  
    const remainingKg = Math.abs(currentWeight - targetWeight);
    return remainingKg / Math.abs(kgPerWeek);
  }
}