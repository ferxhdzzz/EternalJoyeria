import { useState } from "react";

const usePayment = () => {
  const [datosEnviados, setDatosEnviados] = useState(null);
  const [step, setStep] = useState(1);
  const [accessToken, setAccessToken] = useState(null);

  const [formDataTarjeta, setFormDataTarjeta] = useState({
    numeroTarjeta: "",
    cvv: "",
    mesVencimiento: "",
    anioVencimiento: "",
  });

  const [formData, setFormData] = useState({
    monto: 0.01,
    urlRedirect: "https://www.ricaldone.edu.sv",
    nombre: "",
    apellido: "",
    email: "",
    ciudad: "",
    direccion: "",
    idPais: "SV",
    idRegion: "SV-SS",
    codigoPostal: "1101",
    telefono: "",
  });

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeTarjeta = (e) => {
    const { name, value } = e.target;
    setFormDataTarjeta((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setFormData({
      monto: 0.01,
      urlRedirect: "https://www.ricaldone.edu.sv",
      nombre: "",
      apellido: "",
      email: "",
      ciudad: "",
      direccion: "",
      idPais: "SV",
      idRegion: "SV-SS",
      codigoPostal: "1101",
      telefono: "",
    });
    setDatosEnviados(null);
    setStep(1);
    setAccessToken(null);
    setFormDataTarjeta({
      numeroTarjeta: "",
      cvv: "",
      mesVencimiento: "",
      anioVencimiento: "",
    });
  };

  const handleFirstStep = async () => {
    console.log("Generando token de acceso...");

    try {
      // CORRECCIÓN: Usar la ruta correcta con /wompi/
      const tokenResponse = await fetch("http://localhost:3001/api/wompi/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Importante para enviar cookies de autenticación
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Error al obtener token: ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      setAccessToken(tokenData.access_token);

      console.log("Token generado exitosamente");
      setStep(2);
    } catch (error) {
      console.error(`Error al obtener token: ${error.message}`);
      throw error; // Re-lanzar el error para que lo maneje el componente
    }
  };

  const handleFinishPayment = async () => {
    try {
      // Preparar datos para Wompi según su formato esperado
      const wompiPaymentData = {
        numeroTarjeta: formDataTarjeta.numeroTarjeta,
        cvc: formDataTarjeta.cvv,
        nombreTarjetaHabiente: formData.nombre + (formData.apellido ? ` ${formData.apellido}` : ''),
        emailComprador: formData.email,
        direccionComprador: formData.direccion,
        ciudadComprador: formData.ciudad,
        zipComprador: formData.codigoPostal,
        monto: Math.round(formData.monto * 100), // Wompi espera centavos
        moneda: "USD",
        fechaExpiracion: `${formDataTarjeta.mesVencimiento}${formDataTarjeta.anioVencimiento.slice(-2)}`,
        tipoPago: "03", // tarjeta de crédito
        telefonoComprador: formData.telefono,
        idPais: formData.idPais,
        idRegion: formData.idRegion,
      };

      // CORRECCIÓN: Usar la ruta correcta con /wompi/
      const paymentResponse = await fetch(
        "http://localhost:3001/api/wompi/payment3ds",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include', // Importante para enviar cookies de autenticación
          body: JSON.stringify({
            token: accessToken,
            formData: wompiPaymentData,
          }),
        }
      );

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        throw new Error(`Error al procesar pago: ${errorText}`);
      }

      const paymentData = await paymentResponse.json();
      console.log("Respuesta del pago:", paymentData);

      // Verificar si el pago fue aprobado
      if (paymentData.estadoTransaccion === "APROBADA") {
        setStep(3);
        return paymentData; // Retornar datos para uso en el componente
      } else {
        throw new Error(paymentData.mensaje || "Pago rechazado");
      }

    } catch (error) {
      console.error(`Error en el proceso de pago: ${error.message}`);
      throw error; // Re-lanzar el error para que lo maneje el componente
    }
  };

  return {
    formData,
    datosEnviados,
    handleChangeData,
    handleChangeTarjeta,
    formDataTarjeta,
    limpiarFormulario,
    handleFirstStep,
    handleFinishPayment,
    step,
    setStep,
  };
};

export default usePayment;