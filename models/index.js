
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



// Importar la definicion de la tabla Tips de tips.js
var Tip = sequelize.import(path.join(__dirname,'tip'));

// Importar la definicion de la tabla Users de user.js
var User = sequelize.import(path.join(__dirname,'user'));


// Relaciones entre modelos
Tip.belongsTo(Quiz);
Quiz.hasMany(Tip);

// Relacion 1 a N entre User y Quiz:
User.hasMany(Quiz, {foreignKey: 'AuthorId'});
Quiz.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});


exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Tip = Tip;   // exportar definición de tabla Tips
exports.User = User; // exportar definición de tabla Users

exports.Quiz = Quiz; // exportar definición de tabla Quiz

