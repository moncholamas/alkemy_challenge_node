import Express from 'express';
import loginRouter from './Routes/loginRouter';
import characterRouter from './Routes/characterRouter';
import movieRouter from './Routes/movieRouter';
import {validator} from './Helpers/tokenValidator'

const app = Express();

//Middlewares
app.use(Express.json());
app.use(Express.urlencoded({extended:false}));

app.set('port',3000);


//routes
app.use('/auth', loginRouter );

//para estas rutas verifico si poseen token
app.use("/characters", validator ,characterRouter );
app.use("/movies", validator, movieRouter );




export default app;