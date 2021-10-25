import peliculas_series from '../Models/peliculas_series';
import initModels from '../Models/init-models';
import {sequelize} from '../DB/connection';
import { buscarPorGenero, buscarPorTitulo, ordenarPorFecha } from './functions/functionsSearch';
import apariciones from '../Models/apariciones';
import personajes from '../Models/personajes';


export async function getAll(req,res){
    //si no tiene parametros de busqueda devolvemos todas las series/peliculas
    if(Object.keys(req.query).length===0){
        try {
            initModels(sequelize);
            const listado = await peliculas_series.findAll({attributes:['imagen','titulo','fecha_creacion']});
            return res.json({
                data: listado
            });
        } catch (error) {
            console.log(error);
            return res.json({
                msg: "error al obtener peliculas"
            })
        }
    }
    else{
        //hace la busqueda por los parametros ingresados
        const {name, genre, order} = req.query;

        if(name){ return res.json(await buscarPorTitulo(name))}
        if(genre){return res.json(await buscarPorGenero(genre))}
        if(order){return res.json(await ordenarPorFecha(order))}

        //si ingresan cualquier otro parametro de busqueda
        return res.json({
            msg: "no se reconoce el campo para realizar filtros"  
        })
    }
}



export async function getById(req, res){
    const {id} = req.params;
    try {
        initModels(sequelize);
        const detalles = await peliculas_series.findByPk(id,{include:{model:apariciones,as:"personajes_presentes", attributes:['id_personaje']}});
        if(!detalles){return res.json({msg: "no se encontraron coincidencias"})}

        return res.json({
            data: detalles
        })
    } catch (error) {
        console.log(error);
        res.json({msg:"error al buscar por id de pelicula o serie"})
    }
}



export async function newMovie(req,res){
    const {imagen,titulo,fecha_creacion,calificacion,id_genero, listado_personajes} = req.body;
    let personajesPresentes;
    try {
        initModels(sequelize);

        await sequelize.transaction(async (t)=>{
            let nueva;
            try {
                nueva = await peliculas_series.create({
                    imagen, 
                    titulo, 
                    fecha_creacion, 
                    calificacion: calificacion || 3,
                    id_genero: id_genero || 1 //si no se ingresa un genero se ingresa como infantil
                },{transaction:t});
            } catch (error) {
                //encuentra los errores para la validacion del modelo
                if(error.errors !== undefined){
                    return res.json({msg: error.errors[0].message})
                }

                //la restriccion de referencia a la tabla generos la notifico manualmente
                return res.json({msg: "los generos que puede ingresar son infantil(1), accion(2), ciencia ficcion(3), juvenil (4), animado(5)"})
            }
            
    
            //si mandan un arreglo de personajes los agrego a las apariciones de la pelicula
            if(listado_personajes || listado_personajes.length!==0){
                let aparicionesEnMovie = [];
                for (const id_personaje of listado_personajes) {
                    const existePer = await personajes.findByPk(id_personaje);
                    
                    //si no encuntra el personaje muestra un error
                    if(!existePer) {
                        throw new Error(`no se encontraron personajes con el id ${id_personaje}`);
                    }
                    
                    //si existe el personaje lo agrego al arreglo de apariciones
                    aparicionesEnMovie.push({id_personaje, id_pelicula_serie:nueva.id_pelicula_serie})
                }
                personajesPresentes = await apariciones.bulkCreate(aparicionesEnMovie,{transaction:t});
            }

            t.afterCommit(()=>{
                return res.json({
                    data: nueva,
                    personajesPresentes
                });
            });
        });
        
    } catch (error) {
        return res.json({msg: error.message});  
    }
}


export async function deleteMovie(req,res){
    const {id} = req.params;
    try {
        initModels(sequelize);
        const borradas = await peliculas_series.destroy({where:{id_pelicula_serie:id}});
        if(borradas===0){return res.json({msg: "no se encontraron coincidencias para borrar"})}
        
        return res.json({
            msg: "item removido correctamente"
        })
    } catch (error) {
        console.log(error);
        return res.json({
            msg: "error al eliminar el item"
        })
    }
}



export async function updateMovie(req,res){
    //por el momento crea la serie sin genero ni personajes que aparecen
    const {id} = req.params;
    const {imagen,titulo,fecha_creacion,calificacion,id_genero,listado_personajes} = req.body;
    try {
        initModels(sequelize);

        await sequelize.transaction(async (t)=>{   
            let actualizadas; 
            try {
                actualizadas = await peliculas_series.update({
                    imagen, 
                    titulo, 
                    fecha_creacion, 
                    calificacion, 
                    id_genero: id_genero || 1
                },{
                    where:{id_pelicula_serie:id},
                    transaction:t
                });
            } catch (error) {
                 //encuentra los errores para la validacion del modelo
                 if(error.errors !== undefined){
                    return res.json({msg: error.errors[0].message})
                }

                //la restriccion de referencia a la tabla generos la notifico manualmente
                return res.json({msg: "los generos que puede ingresar son infantil(1), accion(2), ciencia ficcion(3), juvenil (4), animado(5)"})
            }

            
            if(actualizadas[0] === 0){
                res.json({msg: "no se encontraron coincidencias para actualizar"})
                throw new Error();
            }
    
    
            //si mandan un arreglo de personajes los agrego a las apariciones de la pelicula
            if(listado_personajes){
                //borro las apariciones para la pelicula serie
                await apariciones.destroy({where:{id_pelicula_serie:id}});
    
                //cargo las nuevas
                let aparicionesEnMovie = [];
                for (const id_personaje of listado_personajes) {
                    const existePer = await personajes.findByPk(id_personaje);
                    
                    //si no encuntra el personaje muestra un error
                    if(!existePer) {
                        res.json({msg: `no se encontraron personajes con el id ${id_personaje}`});
                        throw new Error();
                    } 
                    //si existe el personaje lo agrego al arreglo de apariciones
                    aparicionesEnMovie.push({id_personaje, id_pelicula_serie:id})
                }
                await apariciones.bulkCreate(aparicionesEnMovie,{transaction:t});
            }
            
            t.afterCommit(()=>{
                return res.json({
                    msg: "item actualizado correctamente"
                });
            });
        });
        
    } catch (error) {
        switch (error.parent.code) {
            case "23514":
                return res.json({msg: "el rango para la calificacion debe ser de 1 - 5 incluidos" });
            
            case "23503":
                return res.json({msg: "el id del genero no existe" });

            case "23505":
                return res.json({msg: "el nombre la serie o pelicula ya está registrado" });

            case "22007":
                    return res.json({msg: "por favor ingrese una fecha valida" });
                
            default:
                return res.json({msg: "error al actualizar un item"}); 
        }  
    }
}