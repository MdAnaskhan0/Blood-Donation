import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { env } from '../config/env.js';
import { AppError, asyncHandler } from '../utils/appError.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError('Authentication required', 401);

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await db('users')
    .join('roles', 'roles.id', 'users.role_id')
    .where('users.id', payload.sub)
    .select('users.id', 'users.name', 'users.email', 'users.is_active', 'roles.name as role')
    .first();

  if (!user || !user.is_active) throw new AppError('Account not available', 401);
  req.user = user;
  next();
});

// Role-based authorization: authorize('admin', 'hospital')
export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to do this', 403));
  }
  next();
};
