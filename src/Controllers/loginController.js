import users from '../Models/users';
import initModels from '../Models/init-models';
import {sequelize} from '../DB/connection';
import {encriptar, compararEncryp} from '../Helpers/encrypt'

export async function login(req,res){
    const {name_user, pass_user} = req.body;
    console.log(req.body)
    try {
        initModels(sequelize);
        const userLogeado = await users.findOne({where:{name_user}});
        if(!userLogeado){return res.json({msg:"el nombre de usuario ingresado no existe"})}
        
        //si el usuario existe comparo las claves
        const verification = await compararEncryp(pass_user,userLogeado.pass_user)
        if(!verification){return res.json({msg:"la clave ingresada es incorrecta"})}

        return res.json({
            msg: "Bienvenido",
            token: "token"
        });
    } catch (error) {
        console.log(error);
        return res.json({
        msg: "error al ingresar"
    });
    }
    
}

export  async function logup(req,res){
    const {name_user, pass_user} = req.body;
    try {
        initModels(sequelize);
        const userNuevo = await users.create({
            name_user,
            pass_user : await encriptar(pass_user) //guarda a clave cifrada
        })

        return res.json({
            msg: `usuario creado correctamente, te damos la bienvenida ${userNuevo.name_user}`
        });
    } catch (error) {
        console.log(error);
        if(error.name === 'SequelizeUniqueConstraintError'){
            return res.json({
                msg: "el nombre de usuario ya existe, por favor elige otro"
            });
        }
        return res.json({
            msg: "error al crear el usuario"
        });
    }
}