import Express from 'express';
import {getById, getAll, newPersonaje, deletePersonaje, updatePersonaje} from '../Controllers/characterController'

const router = Express.Router();

//Routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', newPersonaje);
router.delete('/delete/:id', deletePersonaje);
router.put('/update/:id', updatePersonaje);

export default router;