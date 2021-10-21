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
        const {titulo, genre, order} = req.query;

        if(titulo){ return res.json(await buscarPorTitulo(titulo))}
        if(genre){return res.json(await buscarPorGenero(genre))}
        if(order){return res.json(await ordenarPorFecha(order))}

        //si ingresan cualquier otro parametro de busqueda
        return res.json({
            msg: "no se reconoce el campo para realizar filtros, por favor ingrese nombre, peso, edad o pelicula/serie"  
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
    //por el momento crea la serie sin genero ni personajes que aparecen
    const {imagen,titulo,fecha_creacion,calificacion,id_genero, listado_personajes} = req.body;
    let personajesPresentes;
    try {
        initModels(sequelize);
        const nueva = await peliculas_series.create({
            imagen, 
            titulo, 
            fecha_creacion, 
            calificacion,
            id_genero: id_genero || 1 //si no se ingresa un genero se entiende que es infantil
        });

        //si mandan un arreglo de personajes los agrego a las apariciones de la pelicula
        if(listado_personajes || listado_personajes.length!==0){
            let aparicionesEnMovie = [];
            for (const id_personaje of listado_personajes) {
                const existePer = await personajes.findByPk(id_personaje);
                
                //si no encuntra el personaje muestra un error
                if(!existePer) return res.json({msg:"no se encontraron personajes con el id ingresado"})
                
                //si existe el personaje lo agrego al arreglo de apariciones
                aparicionesEnMovie.push({id_personaje, id_pelicula_serie:nueva.id_pelicula_serie})
            }
            personajesPresentes = await apariciones.bulkCreate(aparicionesEnMovie);
        }
        return res.json({
            data: nueva,
            personajesPresentes
        });
    } catch (error) {
        console.log(error);
        return res.json({
            msg: "error al ingresar nueva movie"
        }); 
    }
}


export async function deleteMovie(req,res){
    const {id} = req.params;
    try {
        initModels(sequelize);
        const borradas = peliculas_series.destroy({where:{id_pelicula_serie:id}});
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
    const {imagen,titulo,fecha_creacion,calificacion,genero} = req.body;
    try {
        initModels(sequelize);
        const actualizadas = await peliculas_series.update({
            imagen, titulo, fecha_creacion, calificacion
        },{
            where:{id_pelicula_serie:id}
        });
        if(actualizadas===0){return res.json({msg: "no se encontraron coincidencias para actualizar"})}

        return res.json({
            msg: "item actualizado correctamente"
        });
    } catch (error) {
        console.log(error);
        return res.json({
            msg: "error al  actualizar un item"
        }); 
    }
}