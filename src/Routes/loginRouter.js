import Express from 'express';
import {loginAction} from '../Controllers/loginController'

const router = Express.Router();


router.get('/login', loginAction);
//router.post('/login', login);
//router.post('/register', logup);

export default router;