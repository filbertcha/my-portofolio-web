/**
 * Validate a request part with a zod schema and return a consistent 422 payload.
 * @param {import('zod').ZodTypeAny} schema
 * @param {'body'|'query'|'params'} source
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const errors = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.') || '_';
      if (!errors[key]) errors[key] = issue.message;
    }
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  if (source === 'body') req.body = result.data;
  if (source === 'query') req.validatedQuery = result.data;
  if (source === 'params') req.validatedParams = result.data;

  return next();
};
