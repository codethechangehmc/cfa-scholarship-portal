import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { validationResult } from 'express-validator';
import User from '../models/User';
import {
  createUserValidation,
  updateUserValidation,
  changePasswordValidation,
  changeEmailValidation,
} from '../validators/userValidation';
import { hashPassword } from '../utils/bcryptHash';
import { Session, SessionData } from 'express-session';
import { ensureAuthenticated } from '../middleware/auth';

const router = Router();

type AuthSession = Session & Partial<SessionData>;

type AuthRequest = Request & {
  session: AuthSession;
  user?: any;
  login: (user: any, cb?: (err?: any) => void) => void;
  logout: (cb?: (err?: any) => void) => void;
  isAuthenticated?: () => boolean;
};

/**
 * Register
 * Body: { email, password, role?, profile?: { firstName, lastName, phone, dateOfBirth } }
 * or Body: { email, password, firstName, lastName, phone, dateOfBirth }
 */
router.post('/register', createUserValidation, async (req: Request, res: Response) => {
  const r = req as AuthRequest;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password, role, profile } = req.body;

  const profileData = profile ?? {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
  };

  const newUser = new User({
    email,
    password: await hashPassword(password),
    role: role ?? undefined,
    profile: profileData,
  });

  try {
    await newUser.save();

    const userObj = newUser.toObject();
    delete (userObj as any).password;

    return res.status(201).json({ message: 'User registered successfully', user: userObj });
  } catch (err: any) {
    if (err?.code === 11000) return res.status(400).json({ message: 'Email is already taken.' });
    console.error(err);
    return res.status(500).json({ message: 'Error registering user' });
  }
});

/**
 * Login (Passport local)
 * Body: { email, password }
 */
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const r = req as AuthRequest;

  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message ?? 'Authentication failed' });

    r.login(user, (loginErr?: any) => {
      if (loginErr) return next(loginErr);

      const safeUser = { ...(r.user?.toObject ? r.user.toObject() : r.user) } as any;
      if (safeUser) delete safeUser.password;
      return res.json({ message: 'Login successful', user: safeUser });
    });
  })(req, res, next);
});

/**
 * Logout
 * Accessible to: authenticated users
 */
router.post('/logout', ensureAuthenticated, (req: Request, res: Response) => {
  const r = req as AuthRequest;

  if (r.isAuthenticated && r.isAuthenticated()) {
    r.logout((err?: any) => {
      if (err) return res.status(500).json({ message: 'Error logging out' });
      r.session?.destroy((destroyErr?: any) => {
        if (destroyErr) return res.status(500).json({ message: 'Error destroying session' });
        return res.status(200).json({ message: 'Logout successful' });
      });
    });
  } else {
    return res.status(400).json({ message: 'No user is logged in' });
  }
});

/**
 * Status - get current authenticated user
 * Accessible to: authenticated users
 */
router.get('/status', ensureAuthenticated, (req: Request, res: Response) => {
  const r = req as AuthRequest;
  const safeUser = { ...(r.user?.toObject ? r.user.toObject() : r.user) } as any;
  if (safeUser) delete safeUser.password;
  return res.json(safeUser);
});

/**
 * Change email
 * Body: { email }
 * Accessible to: authenticated users
 */
router.put('/change-email', ensureAuthenticated, changeEmailValidation, async (req: Request, res: Response) => {
  const r = req as AuthRequest;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email } = req.body;
  if (!(r.isAuthenticated && r.isAuthenticated())) return res.status(401).json({ message: 'User not authenticated' });

  try {
    const found = await User.findById(r.user._id);
    if (!found) return res.status(404).json({ message: 'User not found' });

    found.email = email;
    await found.save();
    return res.status(200).json({ message: 'Email updated successfully' });
  } catch (err: any) {
    if (err?.code === 11000) return res.status(400).json({ message: 'Email is already taken' });
    console.error(err);
    return res.status(500).json({ message: 'Error updating email' });
  }
});

/**
 * Change password
 * Body: { password }
 * Accessible to: authenticated users
 */
router.put('/change-password', ensureAuthenticated, changePasswordValidation, async (req: Request, res: Response) => {
  const r = req as AuthRequest;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { password } = req.body;
  if (!(r.isAuthenticated && r.isAuthenticated())) return res.status(401).json({ message: 'User not authenticated' });

  try {
    const found = await User.findById(r.user._id);
    if (!found) return res.status(404).json({ message: 'User not found' });

    found.password = await hashPassword(password);
    await found.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    
    return res.status(500).json({ message: 'Error updating password' });
  }
});

/**
 * Update profile
 * Body: { profile: { firstName, lastName, phone, dateOfBirth } } OR top-level fields
 * Accessible to: authenticated users
 */
router.put('/profile',  ensureAuthenticated, updateUserValidation, async (req: Request, res: Response) => {
  const r = req as AuthRequest;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  if (!(r.isAuthenticated && r.isAuthenticated())) return res.status(401).json({ message: 'User not authenticated' });

  try {
    const found = await User.findById(r.user._id);
    if (!found) return res.status(404).json({ message: 'User not found' });

    const { profile } = req.body;
    if (profile) {
      found.profile.firstName = profile.firstName ?? found.profile.firstName;
      found.profile.lastName = profile.lastName ?? found.profile.lastName;
      found.profile.phone = profile.phone ?? found.profile.phone;
      if (profile.dateOfBirth) found.profile.dateOfBirth = new Date(profile.dateOfBirth);
    } else {
      found.profile.firstName = req.body.firstName ?? found.profile.firstName;
      found.profile.lastName = req.body.lastName ?? found.profile.lastName;
      found.profile.phone = req.body.phone ?? found.profile.phone;
      if (req.body.dateOfBirth) found.profile.dateOfBirth = new Date(req.body.dateOfBirth);
    }

    await found.save();
    const userObj = found.toObject();
    delete (userObj as any).password;
    return res.status(200).json({ message: 'Profile updated', user: userObj });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating profile' });
  }
});

/**
 * Delete user
 * Accessible to: authenticated users
 */
router.delete('/delete-user', ensureAuthenticated, async (req: Request, res: Response) => {
  const r = req as AuthRequest;

  if (!(r.isAuthenticated && r.isAuthenticated())) return res.status(401).json({ message: 'User not authenticated' });

  try {
    const deleted = await User.findByIdAndDelete(r.user._id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    r.session?.destroy((err?: any) => {
      if (err) return res.status(500).json({ message: 'Error deleting session' });
      r.logout(() => {
        return res.status(200).json({ message: 'User deleted and logged out successfully' });
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;
