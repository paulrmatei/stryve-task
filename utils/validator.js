import { body, validationResult } from 'express-validator';

export const validationRules = () => [
  body('title').optional().isString().withMessage('Title must be a string'),
  body('author').optional().isString().withMessage('Author must be a string'),
  body('rating').optional().isInt().withMessage('Rating must be a number'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  return res.status(400).json({ errors: errors.array() });
};
