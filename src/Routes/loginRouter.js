import Express from 'express';
import {login, logup} from '../Controllers/loginController'

const router = Express.Router();


router.post('/login', login);
router.post('/register', logup);

export default router;