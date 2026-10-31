import { Router } from 'express';
import * as contactController from '../controllers/contact.controller.js';
import * as educationController from '../controllers/education.controller.js';
import * as experienceController from '../controllers/experience.controller.js';
import * as profileController from '../controllers/profile.controller.js';
import * as projectController from '../controllers/project.controller.js';
import * as statsController from '../controllers/stats.controller.js';
import * as uploadController from '../controllers/upload.controller.js';
import { uploadImage } from '../middlewares/upload.js';
import { validate } from '../middlewares/validateRequest.js';
import {
  contactSchema,
  educationSchema,
  experienceSchema,
  idParamSchema,
  profileSchema,
  projectSchema,
} from '../validators/schemas.js';

const router = Router();

const withId = [validate(idParamSchema, 'params')];

router.get('/stats', statsController.getStats);
router.get('/technologies', projectController.listTechnologies);

router.get('/profile', profileController.getProfile);
router.put('/profile', validate(profileSchema), profileController.updateProfile);

router.get('/projects', projectController.listAdminProjects);
router.post('/projects', validate(projectSchema), projectController.createProject);
router.get('/projects/:id', ...withId, projectController.getAdminProject);
router.put('/projects/:id', ...withId, validate(projectSchema), projectController.updateProject);
router.delete('/projects/:id', ...withId, projectController.deleteProject);

router.get('/experiences', experienceController.listAdminExperiences);
router.post('/experiences', validate(experienceSchema), experienceController.createExperience);
router.get('/experiences/:id', ...withId, experienceController.getAdminExperience);
router.put(
  '/experiences/:id',
  ...withId,
  validate(experienceSchema),
  experienceController.updateExperience,
);
router.delete('/experiences/:id', ...withId, experienceController.deleteExperience);

router.get('/education', educationController.listAdminEducation);
router.post('/education', validate(educationSchema), educationController.createEducation);
router.get('/education/:id', ...withId, educationController.getAdminEducation);
router.put(
  '/education/:id',
  ...withId,
  validate(educationSchema),
  educationController.updateEducation,
);
router.delete('/education/:id', ...withId, educationController.deleteEducation);

router.get('/contacts', contactController.getContact);
router.put('/contacts', validate(contactSchema), contactController.updateContact);

router.post('/uploads', uploadImage, uploadController.uploadImage);

export default router;
