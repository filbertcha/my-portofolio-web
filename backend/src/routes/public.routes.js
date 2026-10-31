import { Router } from 'express';
import { query } from '../config/database.js';
import * as contactController from '../controllers/contact.controller.js';
import * as educationController from '../controllers/education.controller.js';
import * as experienceController from '../controllers/experience.controller.js';
import * as profileController from '../controllers/profile.controller.js';
import * as projectController from '../controllers/project.controller.js';
import { asyncHandler } from '../lib/HttpError.js';
import { validate } from '../middlewares/validateRequest.js';
import { projectQuerySchema } from '../validators/schemas.js';

const router = Router();

router.get(
  '/health',
  asyncHandler(async (req, res) => {
    let database = 'up';
    try {
      await query('SELECT 1');
    } catch {
      database = 'down';
    }

    const healthy = database === 'up';
    res.status(healthy ? 200 : 503).json({
      success: healthy,
      message: healthy ? 'Service healthy' : 'Service degraded',
      data: {
        status: healthy ? 'ok' : 'degraded',
        database,
        uptime_seconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
      },
    });
  }),
);

router.get('/profile', profileController.getProfile);
router.get('/contacts', contactController.getContact);

router.get(
  '/projects',
  validate(projectQuerySchema, 'query'),
  projectController.listPublicProjects,
);
router.get('/projects/:slug', projectController.getPublicProject);

router.get('/experiences', experienceController.listPublicExperiences);
router.get('/education', educationController.listPublicEducation);

export default router;
