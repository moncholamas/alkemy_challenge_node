import personajes from '../Models/personajes';
import initModels from '../Models/init-models';
import {sequelize} from '../DB/connection'

export async function getAll(req,res){
    if(req.query==={}){
        //si no tiene parámetros de búsqueda devuelve todos los personajes
        try {
            initModels(sequelize);
            const allPersonajes = await personajes.findAll({attributes:['imagen','nombre']});
    
            if (allPersonajes.length===0){return res.status(200).json({msg:"no existe personajes cargados aún"})}
    
            return res.status(200).json({
                data: allPersonajes
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                msg: "error al obtener los personajes"
            })
        }
    }
    else{
        console.log(req.query);
        //hace la busqueda por los parametros ingresados
        //si recibe un nombre busca por este campo
        const {name, edad, peso, peli_o_serie} = req.query;

        //si ingresan el nombre
        if(name){
            const resultado = await buscarPorNombre(name);
            console.log(resultado)
            if(resultado.length===0){return res.json({msg:'no se encontraron coincidencias'})}

            return res.json({
                data: resultado
            });
        }

        //si ingresa una combinacion de filtros


        //si ingresan cualquier otro parametro de busqueda
        return res.json({
            msg: "no se reconoce el campo para realizar filtros, por favor ingrese nombre, peso, edad o pelicula/serie"  
        })
    }
    
}

async function buscarPorNombre(nombre){
    initModels(sequelize);
    const listadoPersonajes = await personajes.findAll({where:{nombre}});
    return listadoPersonajes;
}


export async function newPersonaje(req,res){
    const {nombre, imagen, peso, edad, historia, apariciones}= req.body;
    try {
        initModels(sequelize);
        const nuevo = await personajes.create({
            nombre,
            imagen,
            peso,
            edad,
            historia
        });

        return res.status(201).json({
            msg: "personaje cargado correctamente",
            data: nuevo
        });

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            msg: "error al ingresar nuevo personaje"
        });
    }
}


export async function updatePersonaje(req,res){
    const id = req.params.id;
    const {nombre, imagen, peso, edad, historia, apariciones}= req.body;
    try {
        initModels(sequelize);
        const nuevo = await personajes.update({
            nombre,
            imagen,
            peso,
            edad,
            historia
        },{where:{id_personaje:id}});

        if(nuevo[0] === 0){return res.status(200).json({msg:"no se encontraron coincidencias para actualizar"})}

        return res.status(201).json({
            msg: "personaje editado correctamente"
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "error al actualizar personaje"
        })
    }
}



export async function deletePersonaje(req, res){
    const id = req.params.id;
    initModels(sequelize);
    try {
        const borrado = await personajes.destroy({where:{id_personaje:id}});
        if (borrado === 0){return res.status(200).json({msg:"no se encontraron coincidencias"})};

        return res.status(204).json({
            msg: "personaje borrado con exito"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg:"error al borrar el personaje"
        })
    }
}