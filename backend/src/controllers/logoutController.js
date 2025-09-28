const logoutController = {};

logoutController.logout = async (req, res) => {
  // Limpiar las cookies, con esto, se borra el token.
  // CRÍTICO: Debes especificar los mismos parámetros (especialmente 'path')
  // que usaste cuando creaste la cookie para que el navegador la elimine.
  res.clearCookie("authToken", {
    path: "/", // Asegura que se borre la cookie establecida en la ruta raíz
    // Si usaste secure: true y sameSite: "none" al crearla, DEBES incluirlos aquí
    // secure: true, 
    // sameSite: "None",
  });

  return res.json({ message: "Session closed successfully" });
};

export default logoutController;
