import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class peliculas_series extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id_pelicula_serie: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isUrl:{
          args:true,
          msg: "ingresa un formato de url valida"
        }
      }
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "peliculas_series_titulo_key",
      validate:{
        notEmpty:{
          args: true,
          msg: "el nombre es un campo requerido"
        }
      }
    },
    fecha_creacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    calificacion: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      validate: {
        min:{
          args:1,
          msg: "la puntuación mínima es de 1"
        },
        max: {
          args:5,
          msg: "la puntuación máxima es de 5"
        }
      }
    },
    id_genero: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate:{
        len:{
          args:[[1,5]],
          msg: "los generos que puede ingresar son infantil(1), accion(2), ciencia ficcion(3), juvenil (4), animado(5)"
        }
      },
      references: {
        model: 'generos',
        key: 'id_genero'
      }
    }
  }, {
    sequelize,
    tableName: 'peliculas_series',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "peliculas_series_pkey",
        unique: true,
        fields: [
          { name: "id_pelicula_serie" },
        ]
      },
      {
        name: "peliculas_series_titulo_key",
        unique: true,
        fields: [
          { name: "titulo" },
        ]
      },
    ]
  });
  return peliculas_series;
  }
}
