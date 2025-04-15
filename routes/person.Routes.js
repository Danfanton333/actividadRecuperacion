import {Router} from 'express';
import {showPerson, showPersonId, addPerson, updatePerson, deletePerson} from '../controllers/person.Controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
const apiName ='/person';

router.route(apiName)
    .get(showPerson)
    .post(verifyToken, addPerson);

router.route(`${apiName}/:id`)
    .get(showPersonId)
    .put(verifyToken, updatePerson)
    .delete(verifyToken, deletePerson);
 
export default router;