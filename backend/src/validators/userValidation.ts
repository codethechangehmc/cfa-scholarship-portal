import { body } from 'express-validator';

const requireNameEitherTopLevelOrProfile = body().custom((_, { req }) => {
  const hasProfile = req.body.profile && typeof req.body.profile === 'object';
  const topFirst = req.body.firstName;
  const topLast = req.body.lastName;

  if (hasProfile) {
    if (!req.body.profile.firstName || !req.body.profile.lastName) {
      throw new Error('If profile is provided it must include firstName and lastName');
    }
    return true;
  }

  if (!topFirst || !topLast) {
    throw new Error('Either profile (with firstName and lastName) or top-level firstName and lastName must be provided');
  }
  return true;
});

const passwordValidators = () => [
  body('password')
    .exists().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 8, max: 32 }).withMessage('Password must be between 8 and 32 characters')
    .matches(/[A-Z]/).withMessage('Password must include an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must include a lowercase letter')
    .matches(/[0-9]/).withMessage('Password must include a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must include a special character'),
];

export const createUserValidation = [
  requireNameEitherTopLevelOrProfile,
  
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),

  ...passwordValidators(),

  body('role')
    .optional()
    .isIn(['student', 'admin']).withMessage('Role must be either "student" or "admin"'),

  // profile can be provided as nested object
  body('profile').optional().isObject().withMessage('Profile must be an object'),
  body('profile.firstName')
    .if(body('profile').exists())
    .exists().withMessage('First name is required in profile')
    .isString().withMessage('First name must be a string')
    .isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('profile.lastName')
    .if(body('profile').exists())
    .exists().withMessage('Last name is required in profile')
    .isString().withMessage('Last name must be a string')
    .isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('profile.phone')
    .optional()
    .isString().withMessage('Phone must be a string')
    .isMobilePhone('any').withMessage('Phone must be a valid phone number'),
  body('profile.dateOfBirth')
    .optional()
    .isISO8601().withMessage('dateOfBirth must be an ISO8601 date')
    .toDate(),
];

export const updateUserValidation = [
  // For updates fields are optional
  body('email')
    .optional()
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),

  body('password')
    .optional()
    .isString().withMessage('Password must be a string')
    .isLength({ min: 8, max: 32 }).withMessage('Password must be between 8 and 32 characters')
    .matches(/[A-Z]/).withMessage('Password must include an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must include a lowercase letter')
    .matches(/[0-9]/).withMessage('Password must include a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must include a special character'),

  body('role')
    .optional()
    .isIn(['student', 'admin']).withMessage('Role must be either "student" or "admin"'),

  body('profile').optional().isObject().withMessage('Profile must be an object'),
  body('profile.firstName')
    .optional()
    .isString().withMessage('First name must be a string')
    .isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('profile.lastName')
    .optional()
    .isString().withMessage('Last name must be a string')
    .isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('profile.phone')
    .optional()
    .isString().withMessage('Phone must be a string')
    .isMobilePhone('any').withMessage('Phone must be a valid phone number'),
  body('profile.dateOfBirth')
    .optional()
    .isISO8601().withMessage('dateOfBirth must be an ISO8601 date')
    .toDate(),
];

export const changePasswordValidation = [
  ...passwordValidators()
];

export const changeEmailValidation = [
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),
];

export default {
  createUserValidation,
  updateUserValidation,
  changePasswordValidation,
  changeEmailValidation,
};
