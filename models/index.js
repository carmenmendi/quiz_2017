
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

// Relaciones entre modelos. Relacion 1-a-N.
Tip.belongsTo(Quiz);//Un Tip solo puede pertenecer a un QUiz
Quiz.hasMany(Tip);//Un Quiz puede tener varios Tip.

//Relaciones entre Quiz y Users. Un quiz solo puede tener un autor, pero un user puede tener varios quizzes.
User.hasMany(Quiz, {foreignKey: 'AuthorId'}); //AuthorId coincide con la clave externa
Quiz.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});//Author es la funcion.


//Relaciones entre Tip y User, un usuario puede tener varias pistas, pero, una piesta solo puede tener un autor.
User.hasMany(Tip, {foreignKey: 'AuthorId'});
Tip.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});

exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Tip = Tip; // exportar definición de tabla Tips
exports.User = User;