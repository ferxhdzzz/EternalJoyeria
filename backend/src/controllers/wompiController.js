// backend/src/controllers/wompiController.js
import fetch from 'node-fetch'; // Usamos node-fetch para hacer las peticiones HTTP

// Función para obtener el token de acceso
export const getWompiToken = async (req, res) => {
  try {
    const response = await fetch('https://id.wompi.sv/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: process.env.GRANT_TYPE,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        audience: process.env.AUDIENCE,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data); // Devuelve el token de Wompi
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener token de Wompi' });
  }
};

// Función para hacer un pago de prueba con Wompi
export const testPayment = async (req, res) => {
  try {
    const { token, formData } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token de acceso requerido' });
    }
    if (!formData) {
      return res.status(400).json({ error: 'Datos de pago requeridos' });
    }

    const paymentResponse = await fetch('https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      return res.status(paymentResponse.status).json({ error: errorText });
    }

    const paymentData = await paymentResponse.json();
    res.json(paymentData); // Devuelve los datos del pago
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
};

// Función para procesar el pago con tarjeta (3DS)
export const payment3ds = async (req, res) => {
  try {
    const { token, formData } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token de acceso requerido' });
    }
    if (!formData) {
      return res.status(400).json({ error: 'Datos de pago requeridos' });
    }

    const response = await fetch('https://api.wompi.sv/TransaccionCompra/3Ds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data); // Devuelve la respuesta de la transacción
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
};
