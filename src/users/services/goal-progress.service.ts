import { msToDays } from '@app/common/lib/date';
import { round } from '@app/common/lib/number';
import { toObjectId } from '@app/common/utils';
import { Day, DayDocument } from '@app/days/schemas';
import { Goal } from '@app/users/enums';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

import { GoalProgressDto } from '../dto/goal-progress.dto';
import { UsersRepository } from '../users.repository';

type DayWeightRow = { date: string; weight?: number };
type LatestWeightRow = { weight: number };

@Injectable()
export class GoalProgressService {
  private readonly logger = new Logger(GoalProgressService.name);

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

    const startWeight = Number(user.weight);
    const targetWeight =
      user.targetWeight != null ? Number(user.targetWeight) : null;
    const goal = user.goal;

    const objectUserId = toObjectId(userId);
    const currentWeight = await this.resolveCurrentWeight(objectUserId, startWeight);

    const last14Days = await this.dayModel
      .find({ userId: objectUserId })
      .sort({ date: -1 })
      .limit(14)
      .select('date weight')
      .lean<DayWeightRow[]>()
      .exec();

    if (goal === Goal.Maintain) {
      return {
        startWeight: round(startWeight, 0),
        currentWeight: round(currentWeight, 0),
        targetWeight: targetWeight != null ? round(targetWeight, 0) : null,
        progressPercent: 1,
        kgPerWeek: null,
        estimatedWeeks: null,
      };
    }

    let kgPerWeek: number | null = null;
    let estimatedWeeks: number | null = null;

    if (targetWeight != null) {
      kgPerWeek = this.calculateKgPerWeek(last14Days);
      estimatedWeeks = this.calculateEstimatedWeeks(
        currentWeight,
        targetWeight,
        kgPerWeek,
        goal,
      );
    }

    const progressPercentValue = this.computeProgressPercent(
      goal,
      startWeight,
      currentWeight,
      targetWeight,
    );

    this.logger.log(
      `goal-progress: goal=${goal} start=${startWeight} current=${currentWeight} target=${targetWeight} -> progressPercent=${progressPercentValue}`,
    );

    return {
      startWeight: round(startWeight, 0),
      currentWeight: round(currentWeight, 0),
      targetWeight: targetWeight != null ? round(targetWeight, 0) : null,
      progressPercent:
        progressPercentValue != null
          ? Math.round(progressPercentValue * 100)
          : null,
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

  private async resolveCurrentWeight(
    userObjectId: Types.ObjectId,
    fallback: number,
  ): Promise<number> {
    const latest = await this.dayModel
      .findOne({ userId: userObjectId, weight: { $ne: null } })
      .sort({ date: -1 })
      .select('weight')
      .lean<LatestWeightRow>()
      .exec();
    if (latest?.weight != null && Number.isFinite(latest.weight)) {
      return latest.weight;
    }
    return fallback;
  }

  /**
   * Returns progress 0..1 (rounded to 2 decimals) or null when targetWeight is null.
   * Used directly in the API response.
   */
private computeProgressPercent(
  goal: Goal,
  startWeight: number,
  currentWeight: number,
  targetWeight: number | null,
): number | null {
  if (targetWeight == null) return null;

  if (goal === Goal.Maintain) return 1;

  if (
    !Number.isFinite(startWeight) ||
    !Number.isFinite(currentWeight) ||
    !Number.isFinite(targetWeight)
  ) {
    return null;
  }

  if (goal === Goal.Lose) {
    const total = startWeight - targetWeight;
    if (total <= 0) return 1;

    const lost = startWeight - currentWeight;
    return this.clamp01(lost / total);
  }

  if (goal === Goal.Gain) {
    const total = targetWeight - startWeight;
    if (total <= 0) return 1;

    const gained = currentWeight - startWeight;
    return this.clamp01(gained / total);
  }

  return null;
}

private clamp01(value: number): number {
  const clamped = Math.max(0, Math.min(1, value));
  return Math.round(clamped * 100) / 100;
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