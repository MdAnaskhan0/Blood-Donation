import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import db from '../../config/db.js';
import { env } from '../../config/env.js';
import { AppError, asyncHandler } from '../../utils/appError.js';
import { sendMail } from '../../utils/mailer.js';

const HOURS = 60 * 60 * 1000;

const signToken = (userId) => jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const newToken = () => crypto.randomBytes(32).toString('hex');

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  emailVerified: !!u.email_verified,
});

const findUserByEmail = (email) =>
  db('users')
    .join('roles', 'roles.id', 'users.role_id')
    .where('users.email', email)
    .select('users.*', 'roles.name as role')
    .first();

async function sendVerificationEmail(user, token) {
  const link = `${env.clientUrl}/verify-email?token=${token}`;
  await sendMail({
    to: user.email,
    subject: 'Verify your email - Blood Donation System',
    html: `<p>Hi ${user.name},</p>
      <p>Thanks for joining. Please verify your email address:</p>
      <p><a href="${link}">${link}</a></p>
      <p>This link expires in 24 hours.</p>`,
  });
}

const audit = (userId, action, req, meta) =>
  db('audit_logs')
    .insert({ user_id: userId, action, ip: req.ip, meta: meta ? JSON.stringify(meta) : null })
    .catch(() => {});

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, bloodGroup, city } = req.body;

  if (await findUserByEmail(email)) throw new AppError('An account with this email already exists', 409);

  const roleRow = await db('roles').where({ name: role }).first();
  const passwordHash = await bcrypt.hash(password, 10);
  const token = newToken();

  const userId = await db.transaction(async (trx) => {
    const [id] = await trx('users').insert({
      name,
      email,
      phone: phone || null,
      password_hash: passwordHash,
      role_id: roleRow.id,
      verification_token: token,
      verification_expires: new Date(Date.now() + 24 * HOURS),
    });
    if (role === 'donor') {
      await trx('donor_profiles').insert({ user_id: id, blood_group: bloodGroup || null, city: city || null });
    }
    return id;
  });

  await sendVerificationEmail({ name, email }, token);
  audit(userId, 'register', req, { role });

  res.status(201).json({ message: 'Registered. Please check your email to verify your account.' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  // Same message for unknown email and wrong password to avoid account enumeration.
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.is_active) throw new AppError('This account has been deactivated', 403);
  if (!user.email_verified) throw new AppError('Please verify your email before logging in', 403);

  audit(user.id, 'login', req);
  res.json({ token: signToken(user.id), user: publicUser(user) });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const user = await db('users').where({ verification_token: token }).first();

  if (!user) throw new AppError('Invalid or already used verification link', 400);
  if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
    throw new AppError('Verification link has expired. Please request a new one.', 400);
  }

  await db('users').where({ id: user.id }).update({
    email_verified: true,
    verification_token: null,
    verification_expires: null,
  });
  audit(user.id, 'verify_email', req);
  res.json({ message: 'Email verified. You can now log in.' });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const user = await findUserByEmail(req.body.email);
  if (user && !user.email_verified) {
    const token = newToken();
    await db('users').where({ id: user.id }).update({
      verification_token: token,
      verification_expires: new Date(Date.now() + 24 * HOURS),
    });
    await sendVerificationEmail(user, token);
  }
  // Always the same response.
  res.json({ message: 'If that account exists and is unverified, a new link has been sent.' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await findUserByEmail(req.body.email);
  if (user) {
    const token = newToken();
    await db('users').where({ id: user.id }).update({
      reset_token: token,
      reset_expires: new Date(Date.now() + 1 * HOURS),
    });
    const link = `${env.clientUrl}/reset-password?token=${token}`;
    await sendMail({
      to: user.email,
      subject: 'Reset your password - Blood Donation System',
      html: `<p>Hi ${user.name},</p><p>Reset your password here:</p><p><a href="${link}">${link}</a></p><p>This link expires in 1 hour.</p>`,
    });
  }
  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = await db('users').where({ reset_token: token }).first();
  if (!user || !user.reset_expires || new Date(user.reset_expires) < new Date()) {
    throw new AppError('Invalid or expired reset link', 400);
  }
  await db('users')
    .where({ id: user.id })
    .update({ password_hash: await bcrypt.hash(password, 10), reset_token: null, reset_expires: null });
  audit(user.id, 'reset_password', req);
  res.json({ message: 'Password updated. You can now log in.' });
});

export const me = asyncHandler(async (req, res) => {
  const user = await findUserByEmail(req.user.email);
  res.json({ user: publicUser(user) });
});
