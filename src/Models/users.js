import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class users extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id_user: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mail_user: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: "users_mail_user_key",
      validate:{
        isEmail: true
      }
    },
    pass_user: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_mail_user_key",
        unique: true,
        fields: [
          { name: "mail_user" },
        ]
      },
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
  return users;
  }
}
