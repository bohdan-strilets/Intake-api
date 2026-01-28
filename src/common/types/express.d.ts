import 'express';

import { SessionIdentity } from '@app/auth/types';

declare module 'express' {
  interface Request {
    user?: SessionIdentity;
  }
}
