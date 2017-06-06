
// Modelo
module.exports = function (sequelize, DataTypes) { //Definimos el nombre de la tabla: Quiz
    return sequelize.define('Quiz',
        {
            question: {//El campo question tiene que ser de tipo String
                type: DataTypes.STRING,//y no puede estar vacio, en caso de que lo
                validate: {notEmpty:{msg: "Falta pregunta"}}//este, sale el mensaje msg
            },
            answer: {//Pasa igual con answer
                type: DataTypes.STRING,
                validate: {notEmpty:{msg: "Falta respuesta"}}
            } //Adicionalmente a estos campos estara el campo Id, que se autoincrementa.
        });

};