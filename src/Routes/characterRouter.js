import Express from 'express';
import {getOne, getAll, newPersonaje, deletePersonaje, updatePersonaje} from '../Controllers/characterController'

const router = Express.Router();

//router.get('/:personaje', getOne);
router.get('/', getAll);
router.post('/new', newPersonaje);
router.delete('/delete/:id', deletePersonaje);
router.put('/update/:id', updatePersonaje);

export default router;