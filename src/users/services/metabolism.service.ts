import { Injectable } from '@nestjs/common';

import {
  BMR_COEFFICIENTS,
  DEFAULT_GOAL_DELTAS,
  DEFAULT_MACRO_POLICY,
  MACRO_CALORIES,
} from '../constants';
import { ActivityLevel, Goal, Sex } from '../enums';
import { DailyTargets, MetabolismResult, UserEntity } from '../types';
import { calculateAge } from '../utils';

@Injectable()
export class MetabolismService {
  calculateMetabolism(user: UserEntity): MetabolismResult {
    const bmr = this.calculateBmr(user);
    const tdee = this.calculateTdee(bmr, user.activityLevel);
    const recommended = this.applyGoal(tdee, user.goal, user.goalDelta);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      recommendedCalories: Math.round(recommended),
    };
  }

  calculateDailyTargets(user: UserEntity): DailyTargets {
    const metabolism = this.calculateMetabolism(user);
    const calories = metabolism.recommendedCalories;
    const tdee = metabolism.tdee;

    const protein = Math.round(user.weight * DEFAULT_MACRO_POLICY.proteinPerKg);

    const fat = Math.round((calories * DEFAULT_MACRO_POLICY.fatRatio) / MACRO_CALORIES.fat);

    const carbs = Math.round(
      (calories - protein * MACRO_CALORIES.protein - fat * MACRO_CALORIES.fat) /
        MACRO_CALORIES.carbs,
    );

    return { tdee, calories, protein, fat, carbs };
  }

  // Private methods

  private calculateBmr(user: UserEntity): number {
    const { weight, height, dateOfBirth, sex } = user;
    const age = calculateAge(dateOfBirth);

    const { weight: w, height: h, age: a, maleOffset, femaleOffset } = BMR_COEFFICIENTS;

    const base = w * weight + h * height - a * age;

    return sex === Sex.Male ? base + maleOffset : base + femaleOffset;
  }

  private calculateTdee(bmr: number, activityLevel: ActivityLevel): number {
    return bmr * activityLevel;
  }

  private applyGoal(tdee: number, goal: Goal, goalDelta?: number | null): number {
    if (typeof goalDelta === 'number') {
      return tdee + goalDelta;
    }

    return tdee + DEFAULT_GOAL_DELTAS[goal];
  }
}
