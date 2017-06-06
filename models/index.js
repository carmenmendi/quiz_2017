
var path = require('path');

// Cargar ORM
var Sequelize = require('sequelize');

var url, storage;

if(!process.env.DATABASE_URL){//SI ESTAMOS EN LOCAL SE UTILIZA SQLITE
    url="sqlite://";
    storage = "quiz.sqlite";
} else {//SI ESTAMOS EN EL ENTORNO DE HEROKU SE USA EL URL DE LA BBDD POSTGRES
    url = process.env.DATABASE_URL;
    storage = process.env.DATABASE_STORAGE || "";
}
var sequelize = new  Sequelize(url, {storage: storage});



// Importar la definicion de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));


exports.Quiz = Quiz; // exportar definición de tabla Quiz