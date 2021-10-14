import {Sequelize} from 'sequelize';
import {configuration} from '../config/config'

const sequelize = new Sequelize(
    configuration.db,
    configuration.db_user,
    configuration.db_pass,
    {
        host:configuration.db_server,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        },
        logging: false
    }
);

export {sequelize};