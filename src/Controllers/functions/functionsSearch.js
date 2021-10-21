import {sequelize} from '../../DB/connection';
import initModels from '../../Models/init-models';
import personajes from '../../Models/personajes';
import {Op} from 'sequelize';
import apariciones from '../../Models/apariciones';
import peliculas_series from '../../Models/peliculas_series';



// ------------------------Funciones de busqueda para Personajes -----------------//
export async function buscarPorNombre(nombre){
    try {
        initModels(sequelize);
        const listadoPersonajes = await personajes.findAll({where:{nombre: {[Op.substring]: nombre}}});
        if(listadoPersonajes.length === 0){
            return {
                msg: "no se encontraron personajes que coincidan con la búsqueda"
            }
        }
        return listadoPersonajes;
    } catch (error) {
        return {msg: "error al buscar personajes por nombre"};
    }
}

export async function buscarPorAparicion(id_movie){
    try {
        initModels(sequelize);
        const listadoPersonajes = await personajes.findAll({include:{model:apariciones,as:'apariciones',where:{id_pelicula_serie:id_movie}}});
        if(listadoPersonajes.length===0){
            return {msg: "no se encontraron personajes que hayan participado en la pelicula con el id:", id_movie}
        }
        return listadoPersonajes;
    } catch (error) {
        return {msg: "error al filtrar personajes por peliculas o series"}
    }
    
}

export async function buscarPorEdad(edad){

    try {
        initModels(sequelize);
        const listadoPersonajes = await personajes.findAll({where:{edad}});
        if(listadoPersonajes.length===0){
            return {msg: "no se encontraron personajes con la edad ingresada"}
        }
        return listadoPersonajes;
    } catch (error) {
        return {msg: "error al filtrar por edad"}
    }

    
}

export async function buscarPorPeso(peso){
    try {
        initModels(sequelize);
        const listadoPersonajes = await personajes.findAll({where:{peso}});
        if(listadoPersonajes===0){
            return {msg: "no se encontraron personajes que coincidan con el peso ingresado"}
        }
        return listadoPersonajes;
        
    } catch (error) {
        return {msg: "error al filtrar personajes por peso"}
    }
}


//-------------------------------- funciones de busqueda para movies -----------------//

export async function buscarPorTitulo(titulo){
    try {
        initModels(sequelize);
        const listadoMovies = await peliculas_series.findAll({where:{titulo: {[Op.substring]: titulo}}});
        if(listadoMovies.length===0){
            return {msg: "no se econtraron peliculas con el titulo ingresado"}
        }

        return listadoMovies;
    } catch (error) {
        return {msg: "error al buscar por titulo"}
    }
    
}
export async function buscarPorGenero(id_genero){
    try {
        initModels(sequelize);
        const listadoMovies= await peliculas_series.findAll({where:{id_genero}});
        if(listadoMovies.length===0){
            return {msg: "no se encontraron resultados con el genero seleccionado"}
        }
        
        return listadoMovies;   
    } catch (error) {
        return {msg: "error al filtrar por genero"}
    }    
}
export async function ordenarPorFecha(order){
    try {
        initModels(sequelize);
        const listadoMovies= await peliculas_series.findAll({order:[['fecha_creacion', order.toUpperCase()]]});
        if(listadoMovies.length===0){
            return {msg: "no hay peliculas o series cargadas aun"}
        }
        return listadoMovies;
    } catch (error) {
        return {msg: "error al ordenar por fecha"}
    }
    
}