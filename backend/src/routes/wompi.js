// backend/src/routes/wompi.js
import express from 'express';
import { getWompiToken, testPayment, payment3ds } from '../controllers/wompiController.js';

const router = express.Router();

router.post('/token', getWompiToken);     // token OAuth (mock o real)
router.post('/testPayment', testPayment); // opcional (tokenizada sin 3DS)
router.post('/payment3ds', payment3ds);   // principal (3DS) - usa mock si WOMPI_MODE=mock

export default router;
