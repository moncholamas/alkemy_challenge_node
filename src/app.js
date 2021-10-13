import Express from 'express';
import loginRouter from './Routes/loginRouter'
import characterRouter from './Routes/charactersRouter'


const app = Express();

//Middlewares
app.use(Express.json());
app.use(Express.urlencoded({extended:false}));

app.set('port',3000);


//routes
app.use('/auth', loginRouter );
app.use("/characters", characterRouter );




export default app;