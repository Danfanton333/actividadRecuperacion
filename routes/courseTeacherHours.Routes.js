import {Router} from 'express';
import {showCourseTeacherHours, showCourseTeacherHoursId, addCourseTeacherHours, updateCourseTeacherHours, deleteCourseTeacherHours} from '../controllers/courseTeacherHours.Controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
const apiName ='/courseTeacherHours';

router.route(apiName)
    .get(showCourseTeacherHours)
    .post(verifyToken, addCourseTeacherHours);

router.route(`${apiName}/:id`)
    .get(showCourseTeacherHoursId)
    .put(verifyToken, updateCourseTeacherHours)
    .delete(verifyToken, deleteCourseTeacherHours);
 
export default router;