import Express from 'express';
import {getAll, newMovie, deleteMovie, updateMovie} from '../Controllers/movieController'

const router = Express.Router();


router.get('/', getAll);
router.post('/', newMovie);
router.delete('/delete/:id', deleteMovie);
router.put('/update/:id', updateMovie);

export default router;