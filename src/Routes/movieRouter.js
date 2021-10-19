import Express from 'express';
import {getAll, newMovie, deleteMovie, updateMovie, getById} from '../Controllers/movieController'

const router = Express.Router();


router.get('/', getAll);
router.get('/:id', getById);
router.post('/', newMovie);
router.delete('/delete/:id', deleteMovie);
router.put('/update/:id', updateMovie);

export default router;