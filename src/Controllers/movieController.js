import peliculas_series from '../Models/peliculas_series';
import initModels from '../Models/init-models';
import {sequelize} from '../DB/connection'

export async function getAll(req,res){
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


export async function newMovie(req,res){
    //por el momento crea la serie sin genero ni personajes que aparecen
    const {imagen,titulo,fecha_creacion,calificacion,genero} = req.body;
    try {
        initModels(sequelize);
        const nueva = await peliculas_series.create({
            imagen, titulo, fecha_creacion, calificacion
        });

        return res.json({
            data: nueva
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