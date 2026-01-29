import { SessionIdentity } from '@app/session/types';
import { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: SessionIdentity;
};
