import users from '../Models/users';
import initModels from '../Models/init-models';
import {sequelize} from '../DB/connection';
import {encriptar, compararEncryp} from '../Helpers/encrypt';
import jsonwebtoken from 'jsonwebtoken';
import transport from '../Helpers/mailer';
import {config} from 'dotenv';
config();

export async function login(req,res){
    const {mail_user, pass_user} = req.body;
    try {
        if(pass_user===''||mail_user==='') return res.json({msg: "la clave y el correo son datos obligatorios"});

        initModels(sequelize);
        const userLogeado = await users.findOne({where:{mail_user}});
        if(!userLogeado){return res.json({msg:"la direccion de correo electrónico ingresada no existe"})}
        
        //si el usuario existe comparo las claves
        const verification = await compararEncryp(pass_user,userLogeado.pass_user)
        if(!verification){return res.json({msg:"la clave ingresada es incorrecta"})}

        //creo el token con jwt
        const token = jsonwebtoken.sign(
            {
            id: userLogeado.id_user,
            }
            ,'alkemy',
            {
               expiresIn: 86400 //dura un dia entero el token 
            });

        return res.json({
            msg: `Bienvenido de nuevo ${mail_user}`,
            token
        });
    } catch (error) {
        console.log(error);
        return res.json({
        msg: "error al ingresar"
    });
    }
    
}

export  async function logup(req,res){
    const {mail_user, pass_user} = req.body;

    try {
        if(pass_user===''||mail_user==='') return res.json({msg: "la clave y el correo son datos obligatorios"});
        
        initModels(sequelize);
        let userNuevo;
        try {
            userNuevo = await users.create({
                mail_user,
                pass_user : await encriptar(pass_user) //guarda a clave cifrada
            });
        } catch (error) {
            if(error.errors !== undefined){
                if(error.name === 'SequelizeUniqueConstraintError'){
                    return res.json({
                        msg: "el correo electrónico ya existe, por favor elige otro"
                    });
                }
                return res.json({msg: error.errors[0].message});
                
            }
        }
        

        //creo el token con jwt
        const token = jsonwebtoken.sign(
            {
            id: userNuevo.id_user,
            }
            ,'alkemy',
            {
               expiresIn: 86400 //dura un dia entero el token 
            });
        
        await transport.sendMail({
            from: process.env.MAIL_SENDER ,
            to: `<${mail_user}>`,
            subject: 'Gracias por usar nuestra API',
            html: `<h1>Te damos la bienvenida</h1>
                <h3>Disfruta de los personajes de Disney</h3>
                <p>Con nuestra API podrás encontrar los personajes de tus
                series y peliculas favoritas.
                </p>
                <p>¡Que lo disfrutes!</p>
            `
        });

        return res.json({
            msg: `usuario creado correctamente, te damos la bienvenida ${mail_user}`,
            token,
        });
    } catch (error) {

        return res.json({
            msg: "error al crear el usuario",
        });
    }
}