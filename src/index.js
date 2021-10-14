import app from './app'
import {sequelize} from './DB/connection'


async function main(){
    try {
        await sequelize.authenticate();
        app.listen(app.get('port'),()=>{
            console.log("Servidor corriendo en el puerto: ", app.get('port'));
        });
    } catch (error) {
        console.log(error)
    }
}

main();