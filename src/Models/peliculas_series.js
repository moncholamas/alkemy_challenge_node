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
      allowNull: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    calificacion: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    id_genero: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'generos',
        key: 'id_genero'
      }
    }
  }, {
    sequelize,
    tableName: 'peliculas_series',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "peliculas_series_pkey",
        unique: true,
        fields: [
          { name: "id_pelicula_serie" },
        ]
      },
    ]
  });
  return peliculas_series;
  }
}
