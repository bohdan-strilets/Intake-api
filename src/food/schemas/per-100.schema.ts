import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class Per100g {
  @Prop({ required: true })
  calories: number;

  @Prop({ required: true })
  protein: number;

  @Prop({ required: true })
  fat: number;

  @Prop({ required: true })
  carbs: number;
}
