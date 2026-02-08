import { Router, Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { ensureAuthenticated, requireAdmin } from '../middleware/auth';
import {
  createUserValidation,
  updateUserValidation,
} from '../validators/userValidation';
import { hashPassword } from '../utils/bcryptHash';

const router = Router();

// Middleware to protect admin routes
router.use(ensureAuthenticated);
router.use(requireAdmin);

// GET all users (admin only)
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude password from results
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching users' });
  }
});

// GET user by ID (admin only)
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching user' });
  }
});

// CREATE a new user (admin only)
router.post('/users', createUserValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password, role, profile } = req.body;

  const profileData = profile ?? {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
  };

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email already exists' });
    }

    const newUser = new User({
      email,
      password: await hashPassword(password),
      role: role ?? 'applicant', // Default role for admin-created users
      profile: profileData,
    });

    await newUser.save();
    const userObj = newUser.toObject();
    delete (userObj as any).password;
    return res.status(201).json({ message: 'User created successfully', user: userObj });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating user' });
  }
});

// UPDATE user by ID (admin only)
router.put('/users/:id', updateUserValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { role, profile } = req.body;
    const updateFields: any = { role };

    if (profile) {
      updateFields.profile = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
      };
    } else {
      // Allow updating top-level profile fields directly as well
      if (req.body.firstName) updateFields['profile.firstName'] = req.body.firstName;
      if (req.body.lastName) updateFields['profile.lastName'] = req.body.lastName;
      if (req.body.phone) updateFields['profile.phone'] = req.body.phone;
      if (req.body.dateOfBirth) updateFields['profile.dateOfBirth'] = new Date(req.body.dateOfBirth);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating user' });
  }
});

// DELETE user by ID (admin only)
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;
