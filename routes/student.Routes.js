import {Router} from 'express';
import {showStudent, showStudentId, addStudent, updateStudent, deleteStudent} from '../controllers/student.Controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
const apiName ='/student';

router.route(apiName)
    .get(showStudent)
    .post(verifyToken, addStudent);

router.route(`${apiName}/:id`)
    .get(showStudentId)
    .put(verifyToken, updateStudent)
    .delete(verifyToken, deleteStudent);
 
export default router;