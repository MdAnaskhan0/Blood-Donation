import { AppError } from '../utils/appError.js';

// validate(schema) parses req.body with a Zod schema and replaces it with the parsed value.
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    return next(new AppError(details[0]?.message || 'Validation failed', 422, details));
  }
  req.body = result.data;
  next();
};
