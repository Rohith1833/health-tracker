import type {} from 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      supabaseUserId: string;
      email: string;
    };
  }
}
