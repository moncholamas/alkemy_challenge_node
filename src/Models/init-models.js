import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _apariciones from  "./apariciones.js";
import _generos from  "./generos.js";
import _peliculas_series from  "./peliculas_series.js";
import _personajes from  "./personajes.js";
import _users from  "./users.js";

export default function initModels(sequelize) {
  var apariciones = _apariciones.init(sequelize, DataTypes);
  var generos = _generos.init(sequelize, DataTypes);
  var peliculas_series = _peliculas_series.init(sequelize, DataTypes);
  var personajes = _personajes.init(sequelize, DataTypes);
  var users = _users.init(sequelize, DataTypes);

  peliculas_series.belongsToMany(personajes, { as: 'id_personaje_personajes', through: apariciones, foreignKey: "id_pelicula_serie", otherKey: "id_personaje" });
  personajes.belongsToMany(peliculas_series, { as: 'id_pelicula_serie_peliculas_series', through: apariciones, foreignKey: "id_personaje", otherKey: "id_pelicula_serie" });
  peliculas_series.belongsTo(generos, { as: "id_genero_genero", foreignKey: "id_genero"});
  generos.hasMany(peliculas_series, { as: "peliculas_series", foreignKey: "id_genero"});
  apariciones.belongsTo(peliculas_series, { as: "id_pelicula_serie_peliculas_sery", foreignKey: "id_pelicula_serie"});
  peliculas_series.hasMany(apariciones, { as: "personajes_presentes", foreignKey: "id_pelicula_serie"});
  apariciones.belongsTo(personajes, { as: "id_personaje_personaje", foreignKey: "id_personaje"});
  personajes.hasMany(apariciones, { as: "apariciones", foreignKey: "id_personaje"});

  return {
    apariciones,
    generos,
    peliculas_series,
    personajes,
    users,
  };
}
