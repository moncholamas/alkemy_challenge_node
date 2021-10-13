import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class personajes extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id_personaje: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    edad: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    peso: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    historia: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personajes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "personajes_pkey",
        unique: true,
        fields: [
          { name: "id_personaje" },
        ]
      },
    ]
  });
  return personajes;
  }
}
