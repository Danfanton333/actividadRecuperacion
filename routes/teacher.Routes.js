import {Router} from 'express';
import {showTeacher, showTeacherId, addTeacher, updateTeacher, deleteTeacher} from '../controllers/teacher.Controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
const apiName ='/teacher';

router.route(apiName)
    .get(showTeacher)
    .post(verifyToken, addTeacher);

router.route(`${apiName}/:id`)
    .get(showTeacherId)
    .put(verifyToken, updateTeacher)
    .delete(verifyToken, deleteTeacher);
 
export default router;