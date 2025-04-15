import {Router} from 'express';
import {showCourseStudentName, showCourseStudentNameId, addCourseStudentName, updateCourseStudentName, deleteCourseStudentName} from '../controllers/courseStudentName.Controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
 
const router = Router();
const apiName ='/courseStudentName';

router.route(apiName)
    .get(showCourseStudentName)
    .post(verifyToken, addCourseStudentName);

router.route(`${apiName}/:id`)
    .get(showCourseStudentNameId)
    .put(verifyToken, updateCourseStudentName)
    .delete(verifyToken, deleteCourseStudentName);
 
export default router;