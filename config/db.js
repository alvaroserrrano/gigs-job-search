
const Sequelize = require('sequelize');
module.exports  = new Sequelize('codegig', 'postgres', 'ASR23alcala', {
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max:5,
        min:0,
        acquire:30000,
        idle: 10000
    },
});