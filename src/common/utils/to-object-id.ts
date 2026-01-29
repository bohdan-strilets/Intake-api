import { Types } from 'mongoose';

export const toObjectId = (id: string | Types.ObjectId): Types.ObjectId => {
  if (typeof id === 'string') return new Types.ObjectId(id);

  if (Types.ObjectId.isValid(id)) return id;

  return new Types.ObjectId();
};
