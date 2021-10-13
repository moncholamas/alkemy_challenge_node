import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class apariciones extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id_personaje: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'personajes',
        key: 'id_personaje'
      }
    },
    id_pelicula_serie: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'peliculas_series',
        key: 'id_pelicula_serie'
      }
    }
  }, {
    sequelize,
    tableName: 'apariciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "apariciones_pkey",
        unique: true,
        fields: [
          { name: "id_personaje" },
          { name: "id_pelicula_serie" },
        ]
      },
    ]
  });
  return apariciones;
  }
}
