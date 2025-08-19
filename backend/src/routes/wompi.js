// backend/src/routes/wompi.js
import express from 'express';
import { getWompiToken, payment3ds } from '../controllers/wompiController.js';

const router = express.Router();

// Obtener token OAuth de Wompi
router.post('/token', getWompiToken);

// Pago 3DS
router.post('/payment3ds', payment3ds);

export default router;
