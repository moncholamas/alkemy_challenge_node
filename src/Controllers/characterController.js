import personajes from '../Models/personajes';
import initModels from '../Models/init-models';
import {sequelize} from '../DB/connection';
import { buscarPorNombre, buscarPorAparicion, buscarPorEdad, buscarPorPeso } from './functions/functionsSearch';
import apariciones from '../Models/apariciones';
import peliculas_series from '../Models/peliculas_series';


export async function getAll(req,res){

    //si no tiene parámetros de búsqueda devuelve todos los personajes
    if(Object.keys(req.query).length===0){
        try {
            initModels(sequelize);
            const allPersonajes = await personajes.findAll({attributes:['imagen','nombre']});
            
            //si no encuentra resultado muestra un msj
            if (allPersonajes.length===0){return res.status(200).json({msg:"no existe personajes cargados aún"})}
    
            //si encuentra devuelve el resultado
            return res.status(200).json({
                data: allPersonajes
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                msg: "error al obtener los personajes"
            });
        }
    }
    else{
        //hace la busqueda por los parametros ingresados
        const {name, age, weight, movies} = req.query;
        //si buscan por el nombre o una parte
        if(name){ return res.json(await buscarPorNombre(name));}

        //si pasan el id de alguna movie
        if(movies){return res.json(await buscarPorAparicion(movies));}

        //si se ingresa una edad
        if(age){return res.json( await buscarPorEdad(age));}

        //si se ingresa un peso
        if(weight){return res.json( await buscarPorPeso(weight));}

        //si ingresan cualquier otro parametro que no está definido
        return res.json({
            msg: "no se reconoce el campo para realizar filtros, por favor ingrese nombre, peso, edad o id de pelicula/serie"  
        })
    }
    
}


export async function getById(req, res){
    const {id} = req.params;
    try {
        initModels(sequelize);
        const detalles = await personajes.findByPk(id,{include:{model:apariciones,as:"apariciones",attributes:['id_pelicula_serie']}});
        
        //si no encuntra coincidencias muestra un msj
        if(!detalles){return res.json({msg: "no se encontraron coincidencias"})}
        
        //si encuentra coincidencias devuelve el resultado
        return res.json({
            data: detalles
        })
    } catch (error) {
        console.log(error);
        res.json({msg:"error al buscar por id de personaje"})
    }
}


export async function newPersonaje(req,res){
    const {nombre, imagen, peso, edad, historia, movies}= req.body;
    let aparicionesPersonaje;


    try {

        //para garantizar que se carga todo correctamente (transaccion)
        await sequelize.transaction(async(t)=>{
            initModels(sequelize);
            let nuevo;

            //verifico que cumpla con el modelo
            try {
                nuevo = await personajes.create({
                nombre,
                imagen,
                peso,
                edad,
                historia
            },{
                transaction:t
            });
            }catch(error){
                //si no cumple las restricciones del modelo devuelve el error
                if(error.errors!== undefined){
                    return res.json({msg: error.errors[0].message});
                }
            }   

            //si hay ids de peliculas o series en movies[]
            if(movies && movies.length!==0){
                
                //cargo estas apariciones
                let arrayApariciones = [];
                for (const movie of movies) {
                    //verifico si la movie existe
                    const movieNueva = await peliculas_series.findByPk(parseInt(movie));

                    // si la pelicula no existe muestro un error
                    if(!movieNueva) {
                        throw new Error(`no existe la pelicula con el id: ${movie}`);
                    }
                    
                    //agrego la pelicula al arreglo de apariciones
                    arrayApariciones.push({id_personaje:nuevo.id_personaje, id_pelicula_serie: movie});
                }

                //agrego todo el arreglo de apariciones a la DB
                aparicionesPersonaje = await apariciones.bulkCreate(arrayApariciones,{transaction:t});
            }   
            
            t.afterCommit(
                async()=>{
                    return res.status(201).json({
                        msg: "personaje cargado correctamente",
                        data: nuevo,
                        apariciones: aparicionesPersonaje || null
                    });
                });
                }
            );

    } catch (error) {
        return res.json({msg : error.message}); 
   }
}


export async function updatePersonaje(req,res){
    const id = req.params.id;
    const {nombre, imagen, peso, edad, historia, movies}= req.body;

    try {      
        initModels(sequelize);
        
        await sequelize.transaction(async (t)=>{
            let actualizado;
            try{
                actualizado = await personajes.update({
                    nombre,
                    imagen,
                    peso,
                    edad,
                    historia
                },{where:{id_personaje:id},transaction:t});
            }catch(error){
                if(error.errors !== undefined){
                    return res.json({msg: error.errors[0].message});
                }
            }
            
    
            if(actualizado[0] === 0){
                throw new Error("no se encontraron coincidencias para actualizar");
            }
    
    
            //si hay ids de peliculas o series en movies[]
            if(movies){
                //si es un array vacio se borran las apariciones del personaje
                //elimino todas las apariciones del personaje
                await apariciones.destroy({where:{id_personaje: id}});
    
                //cargo las nuevas
                let arrayApariciones = [];
                for (const movie of movies) {
                    //verifico si la movie existe
                    const movieNueva = await peliculas_series.findByPk(parseInt(movie));
    
                    // si la pelicula no existe muestro un error
                    if(!movieNueva) {
                        res.json({msg: `no existe la pelicula con el id: ${movie}`});
                        throw new Error();
                    }
                    
                    //agrego la pelicula al arreglo de apariciones
                    arrayApariciones.push({id_personaje:id, id_pelicula_serie: movie});
                }
    
                //agrego todo el arreglo de apariciones a la DB
                await apariciones.bulkCreate(arrayApariciones,{transaction:t});
            }

            t.afterCommit(()=>{
                return res.status(201).json({
                    msg: "personaje editado correctamente"
                });
            });
        });

    } catch (error) {
        return res.json({msg: error.message}); 
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