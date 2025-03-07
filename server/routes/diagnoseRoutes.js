// routes/diseaseRoutes.js
import express from 'express';
import { protect } from '../middlewares/authMW.js';
import { analyzeSymptoms } from '../Controllers/diagnoseController.js';

const router = express.Router();

router.use(protect);
router.post('/analyze', analyzeSymptoms);

export default router;