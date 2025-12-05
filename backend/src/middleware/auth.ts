import { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose from 'mongoose';
import type { IUser } from '../models/User';

export type AuthenticatedRequest = Request & {
  user?: IUser | null;
  login?: (user: any, cb?: (err?: any) => void) => void;
  logout?: (cb?: (err?: any) => void) => void;
  isAuthenticated?: () => boolean;
  session?: any;
};

/**
 * Succeeds only if the request has an authenticated session (passport).
 * Returns 401 JSON if no authenticated user is present.
 */
export const ensureAuthenticated: RequestHandler = (req, res, next) => {
  const r = req as AuthenticatedRequest;
  const isAuth = typeof r.isAuthenticated === 'function' ? r.isAuthenticated() : Boolean(r.user);
  if (isAuth) return next();
  return res.status(401).json({ error: 'Authentication required' });
};
/**
 * Succeeds only if the authenticated user has role === 'admin'.
 * If the user is not authenticated returns 401; if authenticated but not admin returns 403.
 */
export const requireAdmin: RequestHandler = (req, res, next) => {
  const r = req as AuthenticatedRequest;
  const currentUser = r.user;
  if (!currentUser) return res.status(401).json({ error: 'Authentication required' });
  if (currentUser.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  return next();
};

/**
 * Attempts to locate an owner id in this order:
 * 1) req.params[field]  2) req.body[field]  3) req.query[field]
 *
 * If the owner id is present and valid, the middleware checks:
 * - if current authenticated user's _id matches owner id
 * - if current authenticated user is admin
 * otherwise respond with 403.
 */
export function requireOwnershipOrAdmin(field = 'userId'): RequestHandler {
  return (req, res, next) => {
    const r = req as AuthenticatedRequest;
    const currentUser = r.user;
    if (!currentUser) return res.status(401).json({ error: 'Authentication required' });

    const params = (r.params as Record<string, unknown>) ?? {};
    const body = (r.body as Record<string, unknown>) ?? {};
    const query = (r.query as Record<string, unknown>) ?? {};

    const rawOwnerId = (params[field] ?? body[field] ?? query[field]) as unknown;
    if (rawOwnerId == null) return res.status(400).json({ error: `${field} is required for ownership check` });

    const ownerIdStr = String(rawOwnerId);
    if (!mongoose.Types.ObjectId.isValid(ownerIdStr)) {
      return res.status(400).json({ error: `${field} is not a valid ObjectId` });
    }

    const currentUserId = String((currentUser as any)._id ?? (currentUser as any).id ?? currentUser);
    if (currentUser.role === 'admin' || currentUserId === ownerIdStr) return next();

    return res.status(403).json({ error: 'Not authorized for this resource' });
  };
}
