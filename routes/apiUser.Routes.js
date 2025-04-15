import { Router } from 'express';
import { showApiUser, showApiUserId, addApiUser, updateApiUser, deleteApiUser, loginApiUser } from '../controllers/apiUser.Controller.js';


const router = Router();
const apiName = '/api_users'; // Prefijo para las rutas de usuarios

// Rutas para usuarios
router.route(apiName)
  .get( showApiUser)  // Obtener todos los usuarios
  .post(addApiUser); // Registrar un nuevo usuario

router.route(`${apiName}/login`)
  .post(loginApiUser); // Iniciar sesión

router.route(`${apiName}/:id`)
  .get(showApiUserId)  // Obtener un usuario por ID
  .put(updateApiUser)  // Actualizar un usuario por ID
  .delete(deleteApiUser); // Eliminar un usuario por ID

export default router;