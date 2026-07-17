import type { NextFunction, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  try {
    const authorization = request.header('authorization');
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;

    if (!token) {
      response.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Missing bearer token.' },
      });
      return;
    }

    if (!env.SUPABASE_URL) {
      throw new Error('SUPABASE_URL is not configured.');
    }

    // Initialize the official Supabase client per-request using the Anon Key.
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    // Verify the token using the Supabase Auth API
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      response.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: error?.message || 'Invalid token.' },
      });
      return;
    }

    if (!user.email) {
      response.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User email is missing.' },
      });
      return;
    }

    const displayName = user.user_metadata?.full_name ?? user.user_metadata?.name;
    const avatarUrl = user.user_metadata?.avatar_url;

    const appUser = await prisma.appUser.upsert({
      where: { supabaseUserId: user.id },
      update: {
        email: user.email,
        displayName,
        avatarUrl,
        lastLoginAt: new Date(),
      },
      create: {
        supabaseUserId: user.id,
        email: user.email,
        displayName,
        avatarUrl,
        lastLoginAt: new Date(),
      },
    });

    request.user = {
      id: appUser.id,
      supabaseUserId: appUser.supabaseUserId,
      email: appUser.email,
    };

    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication failed.';
    response.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message } });
  }
}
