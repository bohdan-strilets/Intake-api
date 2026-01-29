import 'express';

import { SessionIdentity } from '@app/session/types';

declare module 'express' {
  interface Request {
    user?: SessionIdentity;
  }
}
