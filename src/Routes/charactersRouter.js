import Express from 'express';
import {getAll} from '../Controllers/characterController'

const router = Express.Router();


router.get('/', getAll);
//router.post('/login', login);
//router.post('/register', logup);

export default router;