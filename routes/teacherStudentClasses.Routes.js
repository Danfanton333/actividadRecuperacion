import {Router} from 'express';
import {showTeacherStudentClasses, showTeacherStudentClassesId, addTeacherStudentClasses, updateTeacherStudentClasses, deleteTeacherStudentClasses} from '../controllers/teacherStudentClasses.Controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
const apiName ='/teacherStudentClasses';

router.route(apiName)
    .get(showTeacherStudentClasses)
    .post(verifyToken, addTeacherStudentClasses);

router.route(`${apiName}/:id`)
    .get(showTeacherStudentClassesId)
    .put(verifyToken, updateTeacherStudentClasses)
    .delete(verifyToken, deleteTeacherStudentClasses);
 
export default router;