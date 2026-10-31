import { z } from 'zod';

const blankToNull = (value) =>
  typeof value === 'string' && value.trim() === '' ? null : value;

const nullableText = (max) =>
  z
    .preprocess(blankToNull, z.string().trim().max(max).nullable().optional())
    .transform((value) => value ?? null);

const requiredText = (max) =>
  z.string({ required_error: 'This field is required' }).trim().min(1, 'This field is required').max(max);

const urlValue = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => /^https?:\/\//i.test(value), 'Must be a valid http(s) URL');

const nullableUrl = z
  .preprocess(blankToNull, urlValue.nullable().optional())
  .transform((value) => value ?? null);

const imageValue = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => value.startsWith('/') || /^https?:\/\//i.test(value),
    'Must be an uploaded image path or a URL',
  );

const nullableImage = z
  .preprocess(blankToNull, imageValue.nullable().optional())
  .transform((value) => value ?? null);

const dateValue = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format');

const nullableDate = z
  .preprocess(blankToNull, dateValue.nullable().optional())
  .transform((value) => value ?? null);

const slugValue = z
  .preprocess(blankToNull, z
    .string()
    .trim()
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only')
    .nullable()
    .optional())
  .transform((value) => value ?? null);

const technologies = z
  .preprocess((value) => {
    if (value === undefined || value === null || value === '') return [];
    if (typeof value === 'string') return value.split(',');
    return value;
  }, z.array(z.string().trim().min(1, 'Technology cannot be empty').max(100)).max(30))
  .transform((list) => {
    const seen = new Set();
    return list.filter((name) => {
      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });

const requiredTechnologies = technologies.refine(
  (list) => list.length > 0,
  'Add at least one technology',
);

const sortOrder = z.coerce.number().int().min(0).max(9999).default(0);
const flag = z.boolean().default(false);

export const loginSchema = z.object({
  identifier: requiredText(255),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required').max(200),
});

export const profileSchema = z.object({
  full_name: requiredText(150),
  headline: nullableText(255),
  about: nullableText(5000),
  profile_image: nullableImage,
  location: nullableText(150),
});

export const projectSchema = z
  .object({
    title: requiredText(200),
    slug: slugValue,
    short_description: requiredText(500),
    description: nullableText(20000),
    image_url: nullableImage,
    github_url: nullableUrl,
    demo_url: nullableUrl,
    technologies: requiredTechnologies,
    is_featured: flag,
    is_published: flag,
    sort_order: sortOrder,
    start_date: nullableDate,
    end_date: nullableDate,
  })
  .superRefine((data, ctx) => {
    if (data.start_date && data.end_date && data.end_date < data.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end_date'],
        message: 'End date cannot be before start date',
      });
    }
  });

export const experienceSchema = z
  .object({
    company: requiredText(200),
    position: requiredText(200),
    employment_type: nullableText(50),
    location: nullableText(150),
    start_date: dateValue,
    end_date: nullableDate,
    is_current: flag,
    description: requiredText(10000),
    technologies,
    is_published: flag,
    sort_order: sortOrder,
  })
  .superRefine((data, ctx) => {
    if (data.end_date && data.end_date < data.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end_date'],
        message: 'End date cannot be before start date',
      });
    }
  });

export const educationSchema = z
  .object({
    institution: requiredText(200),
    degree: nullableText(100),
    major: requiredText(150),
    start_date: nullableDate,
    end_date: nullableDate,
    is_current: flag,
    description: nullableText(5000),
    is_published: flag,
    sort_order: sortOrder,
  })
  .superRefine((data, ctx) => {
    if (data.start_date && data.end_date && data.end_date < data.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end_date'],
        message: 'End date cannot be before start date',
      });
    }
  });

export const contactSchema = z.object({
  email: z
    .preprocess(blankToNull, z.string().trim().email('Enter a valid email address').max(255).nullable().optional())
    .transform((value) => value ?? null),
  phone: nullableText(50),
  github_url: nullableUrl,
  linkedin_url: nullableUrl,
  website_url: nullableUrl,
  location: nullableText(150),
});

export const projectQuerySchema = z.object({
  featured: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  search: z.string().trim().max(100).optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('Invalid resource id'),
});
