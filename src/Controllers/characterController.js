import personajes from '../Models/personajes';
import initModels from '../Models/init-models';
import {sequelize} from '../DB/connection'
import apariciones from '../Models/apariciones';
import {Op} from 'sequelize';

export async function getAll(req,res){

    //si no tiene parámetros de búsqueda devuelve todos los personajes
    if(Object.keys(req.query).length===0){
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
        //hace la busqueda por los parametros ingresados
        //si recibe un nombre busca por este campo
        const {name, age, weight, movies} = req.query;

        //si ingresan el nombre
        if(name){
            const resultado = await buscarPorNombre(name);
            if(resultado.length===0){return res.json({msg:'no se encontraron personajes con el nombre ingresado'})}

            return res.json({
                data: resultado
            });
        }

        //si pasan el id de alguna movie
        if(movies){
            const resultado = await buscarPorAparicion(movies);
            if(resultado.length===0){return res.json({msg:'no se encontraron personajes con la pelicula o serie ingresada'})}

            return res.json({
                data: resultado
            });
        }

        //si ingresa una combinacion de filtros
        if(age || weight){
            const resultado = await buscar({age,weight});
            if(resultado.length===0){return res.json({msg:'no se encontraron personajes dentro de los parametros de busqueda'})}

            return res.json({
                data: resultado
            });
        }

        //si ingresan cualquier otro parametro de busqueda
        return res.json({
            msg: "no se reconoce el campo para realizar filtros, por favor ingrese nombre, peso, edad o pelicula/serie"  
        })
    }
    
}

async function buscarPorNombre(nombre){
    initModels(sequelize);
    const listadoPersonajes = await personajes.findAll({where:{nombre: {[Op.substring]: nombre,}}});
    return listadoPersonajes;
}

async function buscarPorAparicion(id_movie){
    initModels(sequelize);
    const listadoPersonajes = await personajes.findAll({include:{model:apariciones,as:'apariciones',where:{id_pelicula_serie:id_movie}}});
    return listadoPersonajes;
}

async function buscarPorEdad(edad){
    const coincidencias = {}
    initModels(sequelize);
    const listadoPersonajes = await personajes.findAll({where:{coincidencias}});
    return listadoPersonajes;
}

async function buscarPorPeso(peso){
    const coincidencias = {}
    initModels(sequelize);
    const listadoPersonajes = await personajes.findAll({where:{coincidencias}});
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