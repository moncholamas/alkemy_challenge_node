import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class generos extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id_genero: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'generos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "generos_pkey",
        unique: true,
        fields: [
          { name: "id_genero" },
        ]
      },
    ]
  });
  return generos;
  }
}
