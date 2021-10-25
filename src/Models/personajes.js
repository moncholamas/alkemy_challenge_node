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
      allowNull: false,
      validate:{
        notEmpty:{
          args: true,
          msg: "la imagen es un campo requerido"
        },
        isUrl: {
          args:true,
          msg: "ingresa un formato de url valida"
        }
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:{
        args:true,
        msg:"el nombre ingresado ya se encuentra registrado"
      },
      validate:{
        notEmpty:{
          args: true,
          msg: "el nombre es un campo requerido"
        }
      }
    },
    edad: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      validate:{
        max: 200,                  
        min: 1
      }
    },
    peso: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      validate:{
        max: {
          args:500,
          msg: "el peso no debe ser superior a 500"
        },                  
        min: {
          args: 1,
          msg: "el peso debe ser un numero positivo"
        }
      }
    },
    historia: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personajes',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "personajes_nombre_key",
        unique: true,
        fields: [
          { name: "nombre" },
        ]
      },
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
