// backend/src/routes/wompi.js
import express from 'express';
import { getWompiToken, testPayment, payment3ds } from '../controllers/wompiController.js';

const router = express.Router();

// Ruta para obtener el token de Wompi
router.post('/token', getWompiToken);

// Ruta para realizar un pago de prueba
router.post('/testPayment', testPayment);

// Ruta para procesar el pago con tarjeta (3DS)
router.post('/payment3ds', payment3ds);

export default router;
