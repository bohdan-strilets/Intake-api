import { Injectable } from '@nestjs/common';

import { ActivityLevel, Goal, Sex } from '../enums';
import { MetabolismResult, UserEntity } from '../types';

@Injectable()
export class MetabolismService {
  calculate(user: UserEntity): MetabolismResult {
    const bmr = this.calculateBmr(user);
    const tdee = this.calculateTdee(bmr, user.activityLevel);
    const recommended = this.applyGoal(tdee, user.goal, user.goalDelta);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      recommendedCalories: Math.round(recommended),
    };
  }

  private calculateBmr(user: UserEntity): number {
    const { weight, height, age, sex } = user;

    if (sex === Sex.Male) {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    }

    return 10 * weight + 6.25 * height - 5 * age - 161;
  }

  private calculateTdee(bmr: number, activityLevel: ActivityLevel): number {
    return bmr * activityLevel;
  }

  private applyGoal(tdee: number, goal: Goal, goalDelta?: number | null): number {
    if (typeof goalDelta === 'number') {
      return tdee + goalDelta;
    }

    switch (goal) {
      case Goal.Lose:
        return tdee - 500;

      case Goal.Gain:
        return tdee + 300;

      case Goal.Maintain:
      default:
        return tdee;
    }
  }
}
