import customersModel from "../models/Customers.js";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";
import jwt from "jsonwebtoken";


// Configurar Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const customersController = {};


// Obtener al cliente autenticado
customersController.getCurrentCustomer = async (req, res) => {
  try {
    console.log("Sesión del usuario:", req.session.userId);
    const userId = req.userId; // Viene del middleware

    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const customer = await customersModel.findById(userId);

    if (!customer) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener datos del usuario" });
  }
};






// SELECT (Obtener todos los clientes)
customersController.getcustomers = async (req, res) => {
  try {
    const customers = await customersModel.find();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

// SELECT (Obtener un cliente por ID)
customersController.getCustomerById = async (req, res) => {
  try {
    const customer = await customersModel.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener cliente" });
  }
};

// DELETE (Eliminar cliente por ID)
customersController.deletecustomers = async (req, res) => {
  try {
    // Validación: verificar que el ID sea válido
    if (!req.params.id || req.params.id.trim() === '') {
      return res.status(400).json({ message: "ID del cliente es requerido" });
    }

    const deletedCustomer = await customersModel.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar cliente" });
  }
};

// UPDATE (Actualizar un cliente)
customersController.updatecustomers = async (req, res) => {
  try {
    // Validación: verificar que el ID sea válido
    if (!req.params.id || req.params.id.trim() === '') {
      return res.status(400).json({ message: "ID del cliente es requerido" });
    }

    const { firstName, lastName, email, password, phone } = req.body;

    // Validación: verificar que al menos un campo esté presente para actualizar
    if (!firstName && !lastName && !email && !password && !phone && !req.file) {
      return res.status(400).json({ message: "Al menos un campo debe ser proporcionado para actualizar" });
    }

    // Validación: verificar formato de email si se proporciona
    if (email && email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Formato de email inválido" });
      }
      
      // Validación de duplicados: verificar que el email no esté registrado por otro cliente
      const existingCustomer = await customersModel.findOne({ 
        email: email, 
        _id: { $ne: req.params.id } // Excluir el cliente actual
      });
      if (existingCustomer) {
        return res.status(400).json({ message: "El email ya está registrado por otro cliente" });
      }
    }

    // Validación: verificar longitud mínima de contraseña si se proporciona
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
      }
    }

    // Validación: verificar que nombre y apellido no estén vacíos si se proporcionan
    if (firstName && firstName.trim() === '') {
      return res.status(400).json({ message: "El nombre no puede estar vacío" });
    }
    // Validación: nombres mínimo 2 caracteres, máximo 50
    if (firstName && firstName.trim() !== '') {
      if (firstName.trim().length < 2 || firstName.trim().length > 50) {
        return res.status(400).json({ message: "El nombre debe tener entre 2 y 50 caracteres" });
      }
    }
    
    if (lastName && lastName.trim() === '') {
      return res.status(400).json({ message: "El apellido no puede estar vacío" });
    }
    // Validación: apellidos mínimo 2 caracteres, máximo 50
    if (lastName && lastName.trim() !== '') {
      if (lastName.trim().length < 2 || lastName.trim().length > 50) {
        return res.status(400).json({ message: "El apellido debe tener entre 2 y 50 caracteres" });
      }
    }

    // Validación: verificar formato básico de teléfono si se proporciona
    if (phone && phone.trim() !== '') {
      const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Formato de teléfono inválido" });
      }
    }

    let updateData = { firstName, lastName, email, phone };

    if (password) {
      const passwordHash = await bcryptjs.hash(password, 10);
      updateData.password = passwordHash;
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles",
   
 
      });
      updateData.profilePicture = result.secure_url;
    }

    const updatedClient = await customersModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json({
      message: "Client updated",
      client: updatedClient
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Método para renovar token
customersController.refreshToken = async (req, res) => {
  try {
    const { authToken } = req.cookies;
    
    if (!authToken) {
      return res.status(401).json({ 
        message: "No hay token para renovar",
        code: "NO_TOKEN"
      });
    }

    // Intentar decodificar el token (incluso si está expirado)
    let decoded;
    try {
      decoded = jwt.verify(authToken, config.jwt.jwtSecret, { ignoreExpiration: true });
    } catch (error) {
      return res.status(401).json({ 
        message: "Token inválido",
        code: "INVALID_TOKEN"
      });
    }

    // Verificar que el usuario existe
    const customer = await customersModel.findById(decoded.id);
    if (!customer) {
      return res.status(404).json({ 
        message: "Usuario no encontrado",
        code: "USER_NOT_FOUND"
      });
    }

    // Generar nuevo token
    const newToken = jwt.sign(
      { 
        id: customer._id, 
        email: customer.email, 
        userType: "customer" 
      },
      config.jwt.jwtSecret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Establecer nueva cookie
    res.cookie('authToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.json({
      message: "Token renovado exitosamente",
      user: {
        id: customer._id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        userType: "customer"
      }
    });

  } catch (error) {
    console.error("Error al renovar token:", error);
    res.status(500).json({ 
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR"
    });
  }
};

// Método para actualizar el perfil del usuario autenticado
customersController.updateCurrentCustomer = async (req, res) => {
  try {
    console.log('🚀 Iniciando updateCurrentCustomer...');
    console.log('📝 Request body:', req.body);
    console.log('📁 Request file:', req.file);
    console.log('🔐 Request cookies:', req.cookies);
    
    const userId = req.userId; // Viene del middleware validateAuthToken
    console.log('📝 Actualizando perfil del usuario autenticado:', userId);

    if (!userId) {
      console.log('❌ No hay userId en req.userId');
      return res.status(401).json({ message: "No autenticado" });
    }

    const { firstName, lastName, email, password, phone } = req.body;
    console.log('📝 Datos recibidos:', { firstName, lastName, email, phone, hasPassword: !!password });

    // Validación: verificar que al menos un campo esté presente para actualizar
    if (!firstName && !lastName && !email && !password && !phone && !req.file) {
      console.log('❌ No hay campos para actualizar');
      return res.status(400).json({ message: "Al menos un campo debe ser proporcionado para actualizar" });
    }

    // Validación: verificar formato de email si se proporciona
    if (email && email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('❌ Email inválido:', email);
        return res.status(400).json({ message: "Formato de email inválido" });
      }
      
      // Validación de duplicados: verificar que el email no esté registrado por otro cliente
      const existingCustomer = await customersModel.findOne({ 
        email: email, 
        _id: { $ne: userId } // Excluir el usuario actual
      });
      if (existingCustomer) {
        console.log('❌ Email ya existe:', email);
        return res.status(400).json({ message: "El email ya está registrado por otro cliente" });
      }
    }

    // Validación: verificar longitud mínima de contraseña si se proporciona
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        console.log('❌ Contraseña muy corta:', password.length);
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
      }
    }

    // Validación: verificar que nombre y apellido no estén vacíos si se proporcionan
    if (firstName && firstName.trim() === '') {
      console.log('❌ Nombre vacío');
      return res.status(400).json({ message: "El nombre no puede estar vacío" });
    }
    // Validación: nombres mínimo 2 caracteres, máximo 50
    if (firstName && firstName.trim() !== '') {
      if (firstName.trim().length < 2 || firstName.trim().length > 50) {
        console.log('❌ Nombre con longitud inválida:', firstName.trim().length);
        return res.status(400).json({ message: "El nombre debe tener entre 2 y 50 caracteres" });
      }
    }
    
    if (lastName && lastName.trim() === '') {
      console.log('❌ Apellido vacío');
      return res.status(400).json({ message: "El apellido no puede estar vacío" });
    }
    // Validación: apellidos mínimo 2 caracteres, máximo 50
    if (lastName && lastName.trim() !== '') {
      if (lastName.trim().length < 2 || lastName.trim().length > 50) {
        console.log('❌ Apellido con longitud inválida:', lastName.trim().length);
        return res.status(400).json({ message: "El apellido debe tener entre 2 y 50 caracteres" });
      }
    }

    // Validación: verificar formato básico de teléfono si se proporciona
    if (phone && phone.trim() !== '') {
      const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
      if (!phoneRegex.test(phone)) {
        console.log('❌ Teléfono inválido:', phone);
        return res.status(400).json({ message: "Formato de teléfono inválido" });
      }
    }

    let updateData = { firstName, lastName, email, phone };
    console.log('📝 Datos base para actualizar:', updateData);

    if (password) {
      console.log('🔐 Hasheando contraseña...');
      const passwordHash = await bcryptjs.hash(password, 10);
      updateData.password = passwordHash;
      console.log('✅ Contraseña hasheada');
    }

    if (req.file) {
      console.log('📸 Procesando nueva foto de perfil para usuario:', userId);
      console.log('📁 Archivo recibido:', {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
      
      try {
        // Verificar que el archivo existe y es legible
        if (!req.file.path) {
          console.log('❌ No hay ruta de archivo');
          return res.status(400).json({ message: "Archivo no válido" });
        }

        // Verificar que es una imagen
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
          console.log('❌ Tipo de archivo no permitido:', req.file.mimetype);
          return res.status(400).json({ message: "Solo se permiten imágenes (JPEG, PNG, GIF)" });
        }

        // Verificar tamaño del archivo (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (req.file.size > maxSize) {
          console.log('❌ Archivo muy grande:', req.file.size, 'bytes');
          return res.status(400).json({ message: "El archivo es muy grande. Máximo 5MB" });
        }

        console.log('☁️ Subiendo a Cloudinary...');
        console.log('☁️ Configuración Cloudinary:', {
          cloud_name: config.cloudinary.cloud_name,
          has_api_key: !!config.cloudinary.api_key,
          has_api_secret: !!config.cloudinary.api_secret
        });

        // Subir nueva imagen a Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "profiles",
          allowed_formats: ["png", "jpg", "jpeg", "gif"],
          transformation: [
            { width: 500, height: 500, crop: "fill" },
            { quality: "auto" }
          ],
          resource_type: "image"
        });
        
        console.log('✅ Resultado de Cloudinary:', result);
        updateData.profilePicture = result.secure_url;
        console.log('✅ Nueva foto subida a Cloudinary:', result.secure_url);

        // Limpiar archivo temporal
        try {
          const fs = await import('fs');
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Archivo temporal eliminado');
        } catch (cleanupError) {
          console.warn('⚠️ No se pudo eliminar archivo temporal:', cleanupError.message);
        }

      } catch (cloudinaryError) {
        console.error('❌ Error subiendo a Cloudinary:', cloudinaryError);
        
        // Limpiar archivo temporal en caso de error
        try {
          const fs = await import('fs');
          if (req.file.path) {
            fs.unlinkSync(req.file.path);
            console.log('🗑️ Archivo temporal eliminado después del error');
          }
        } catch (cleanupError) {
          console.warn('⚠️ No se pudo eliminar archivo temporal:', cleanupError.message);
        }

        // Devolver error específico
        if (cloudinaryError.message.includes('Invalid api_key')) {
          return res.status(500).json({ message: "Error de configuración de Cloudinary" });
        } else if (cloudinaryError.message.includes('File too large')) {
          return res.status(400).json({ message: "El archivo es muy grande" });
        } else {
          return res.status(500).json({ 
            message: "Error al subir la imagen. Inténtalo de nuevo.",
            details: cloudinaryError.message
          });
        }
      }
    }

    // Actualizar solo los campos proporcionados
    const updateFields = {};
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null && updateData[key] !== '') {
        updateFields[key] = updateData[key];
      }
    });

    console.log('📝 Campos finales a actualizar:', updateFields);

    if (Object.keys(updateFields).length === 0) {
      console.log('❌ No hay campos válidos para actualizar');
      return res.status(400).json({ message: "No hay campos válidos para actualizar" });
    }

    console.log('💾 Actualizando en base de datos...');
    const updatedCustomer = await customersModel.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      console.log('❌ Usuario no encontrado en base de datos');
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log('✅ Usuario actualizado exitosamente:', {
      id: updatedCustomer._id,
      firstName: updatedCustomer.firstName,
      lastName: updatedCustomer.lastName,
      email: updatedCustomer.email,
      profilePicture: updatedCustomer.profilePicture
    });

    return res.status(200).json({
      message: "Perfil actualizado exitosamente",
      client: updatedCustomer
    });
  } catch (error) {
    console.error('❌ Error actualizando perfil del usuario autenticado:', error);
    console.error('❌ Stack trace:', error.stack);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Método para probar Cloudinary
customersController.testCloudinary = async (req, res) => {
  try {
    console.log('🧪 Probando Cloudinary...');
    
    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó imagen de prueba" });
    }

    console.log('📁 Archivo de prueba recibido:', {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Verificar configuración
    if (!config.cloudinary.cloud_name || !config.cloudinary.api_key || !config.cloudinary.api_secret) {
      console.log('❌ Configuración incompleta de Cloudinary');
      return res.status(500).json({ 
        message: "Configuración incompleta de Cloudinary",
        config: {
          cloud_name: !!config.cloudinary.cloud_name,
          api_key: !!config.cloudinary.api_key,
          api_secret: !!config.cloudinary.api_secret
        }
      });
    }

    try {
      // Intentar subir imagen de prueba
      console.log('☁️ Subiendo imagen de prueba a Cloudinary...');
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "test",
        allowed_formats: ["png", "jpg", "jpeg", "gif"],
        resource_type: "image"
      });
      
      console.log('✅ Imagen de prueba subida exitosamente:', result.secure_url);
      
      // Limpiar archivo temporal
      try {
        const fs = await import('fs');
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Archivo temporal eliminado');
      } catch (cleanupError) {
        console.warn('⚠️ No se pudo eliminar archivo temporal:', cleanupError.message);
      }

      // Eliminar imagen de prueba de Cloudinary
      try {
        await cloudinary.uploader.destroy(result.public_id);
        console.log('🗑️ Imagen de prueba eliminada de Cloudinary');
      } catch (deleteError) {
        console.warn('⚠️ No se pudo eliminar imagen de prueba:', deleteError.message);
      }

      res.json({
        message: "Cloudinary funciona correctamente",
        testImage: result.secure_url,
        publicId: result.public_id
      });

    } catch (uploadError) {
      console.error('❌ Error subiendo imagen de prueba:', uploadError);
      
      // Limpiar archivo temporal en caso de error
      try {
        const fs = await import('fs');
        if (req.file.path) {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Archivo temporal eliminado después del error');
        }
      } catch (cleanupError) {
        console.warn('⚠️ No se pudo eliminar archivo temporal:', cleanupError.message);
      }

      res.status(500).json({
        message: "Error al subir imagen de prueba",
        error: uploadError.message,
        code: uploadError.http_code || 'UNKNOWN'
      });
    }

  } catch (error) {
    console.error('❌ Error general en testCloudinary:', error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export default customersController;