import { Types } from 'mongoose';

export const mapObjectId = (id: Types.ObjectId) => id.toHexString();
