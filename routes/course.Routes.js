import {Router} from 'express';
import {showCourse, showCourseId, addCourse, updateCourse, deleteCourse} from '../controllers/course.Controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
const apiName ='/course';

router.route(apiName)
    .get(showCourse)
    .post(verifyToken, addCourse);

router.route(`${apiName}/:id`)
    .get(showCourseId)
    .put(verifyToken, updateCourse)
    .delete(verifyToken, deleteCourse);
 
export default router;
