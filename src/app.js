import Express from 'express';
import loginROuter from './Routes/loginRouter'

const app = Express();

//Middlewares
app.use(Express.json());
app.use(Express.urlencoded({extended:false}));

app.set('port',3000);


//routes
app.use('/auth',loginROuter)





export default app;