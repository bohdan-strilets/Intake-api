import { Request } from 'express';

import { SessionIdentity } from './session-identity.type';

export type AuthenticatedRequest = Request & {
  user: SessionIdentity;
};
