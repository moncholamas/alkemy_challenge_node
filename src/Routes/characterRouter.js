import Express from 'express';
import {getOne, getAll, newPersonaje, deletePersonaje, updatePersonaje} from '../Controllers/characterController'

const router = Express.Router();

//Routes
router.get('/', getAll);
router.post('/', newPersonaje);
router.delete('/delete/:id', deletePersonaje);
router.put('/update/:id', updatePersonaje);

export default router;