import {config} from 'dotenv';
config();

export const configuration = {
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,
    db: process.env.DB,
    db_server: process.env.DB_SERVER
}