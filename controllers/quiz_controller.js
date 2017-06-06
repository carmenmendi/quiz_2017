var models = require("../models");
var Sequelize = require('sequelize');

var paginate = require('../helpers/paginate').paginate;


// Autoload el quiz asociado a :quizId
exports.load = function (req, res, next, quizId) {

    models.Quiz.findById(quizId, {
        include: [
            models.Tip,
            {model: models.User, as: 'Author'}
        ]
    })
    .then(function (quiz) {
        if (quiz) {
            req.quiz = quiz;
            next();
        } else {
            throw new Error('No existe ningún quiz con id=' + quizId);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


// MW que permite acciones solamente si al usuario logeado es admin o es el autor del quiz.
exports.adminOrAuthorRequired = function(req, res, next){

    var isAdmin  = req.session.user.isAdmin;
    var isAuthor = req.quiz.AuthorId === req.session.user.id;

    if (isAdmin || isAuthor) {
        next();
    } else {
        console.log('Operación prohibida: El usuario logeado no es el autor del quiz, ni un administrador.');
        res.send(403);
    }
};


// GET /quizzes


//Autoload el quiz asociado a :quizId
exports.load = function (req, res, next, quizId) {//Incluimos un parametro en la peticion que es quiz, solo si existe
    models.Quiz.findById(quizId)//Realizamos la consulta a la base de datos
        .then(function (quiz) {//que nos devuelve un quiz, que es el que pasamos como parametro en la peticion
            if(quiz){
                req.quiz = quiz;
                next();
            } else {
                throw new Error('No existe ningún quiz con id=' + quizId);
            }
        })
        .catch(function (error) {
            next(error);
        });

};


//GET /quizzes 
>>>>>>> practica52
exports.index = function (req, res, next) {

    var countOptions = {
        where: {}
    };

    var title = "Preguntas";

    //Busquedas:
    var search = req.query.search || '';
    if(search){
        var search_like = "%" + search.replace(/ +/g,"%") + "%";


        countOptions.where.question = { $like: search_like };
    }

    // Si existe req.user, mostrar solo sus preguntas.
    if (req.user) {
        countOptions.where.AuthorId = req.user.id;
        title = "Preguntas de " + req.user.username;

        countOptions.where = {question: {like: search_like}};

    }
    models.Quiz.count(countOptions)

    .then(function (count) {

        // Paginacion:

        var items_per_page = 10;

        // La pagina a mostrar viene en la query
        var pageno = parseInt(req.query.pageno) || 1;

        // Crear un string con el HTML que pinta la botonera de paginacion.
        // Lo añado como una variable local de res para que lo pinte el layout de la aplicacion.
        res.locals.paginate_control = paginate(count, items_per_page, pageno, req.url);

        var findOptions = countOptions;

        findOptions.offset = items_per_page * (pageno - 1);
        findOptions.limit = items_per_page;
        findOptions.include = [{model: models.User, as: 'Author'}];

        return models.Quiz.findAll(findOptions);
    })
    .then(function (quizzes) {
        res.render('quizzes/index.ejs', {
            quizzes: quizzes,
            search: search,
            title: title

        .then(function (count) {

            //Elemento para paginacion
            var itmes_per_page = 10;
            //Extraemos el num de pagina a mostrar que viene en la query
            //si no viene ninguno ponemos la primera pagina por defecto.
            var pageno = parseInt(req.query.pageno) || 1;
            //Creamos un string para que pinte la botonera y se añade como variable al layout
            res.locals.paginate_control = paginate(count, itmes_per_page, pageno, req.url);
            var findOptions = countOptions;

            findOptions.offset = itmes_per_page*(pageno-1);
            findOptions.limit = itmes_per_page;
            return models.Quiz.findAll(findOptions);
        })
        .then(function (quizzes) {
            res.render('quizzes/index.ejs', {
                quizzes: quizzes,
                search: search
            });
        })
        .catch(function (error) {//Se activa si ocurre un error en el acceso a la base de datos
            next(error);

        });
};



//GET /quizzes/:quizId
exports.show=function (req, res, next) {

   res.render('quizzes/show', {quiz: req.quiz});
};

//GET /quizzes/new
exports.new = function (req, res, next) {//Funcion que se encarga de mandar al usuario a la vista de crear

    var quiz = {question: "", answer: ""};
    res.render('quizzes/new', {quiz: quiz});
};

//POST /quizzes
exports.create = function (req, res, next) {//funcion que a partir de los datos rellenados por el usuario crea la pregunta


// POST /quizzes/create
exports.create = function (req, res, next) {

    var authorId = req.session.user && req.session.user.id || 0;

    var quiz = models.Quiz.build({
        question: req.body.question,
        answer: req.body.answer,
        AuthorId: authorId
    });

    // guarda en DB los campos pregunta y respuesta de quiz
    quiz.save({fields: ["question", "answer", "AuthorId"]})
    .then(function (quiz) {
        req.flash('success', 'Quiz creado con éxito.');
        res.redirect('/quizzes/' + quiz.id);
    })
    .catch(Sequelize.ValidationError, function (error) {

        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        }

    var quiz= models.Quiz.build({//Extraemos los datos que ha rellenado el usuario en el formulario
       question: req.body.question,
       answer: req.body.answer
    });

    //ahora guardamos los datos
    quiz.save({fields: ["question", "answer"]})
        .then(function (quiz) {
            req.flash('success', 'Quiz creado con éxito');
            res.redirect('/quizzes/' + quiz.id);
        })
        .catch(Sequelize.ValidationError, function (error) {//Si algun dato no es correcto motramos en la consola los errores
            req.flash('error', 'Errores en el formulario:');
            for (var i in error.errors){
                req.flash('error', error.errors[i].value);
            }
            res.render('quizzes/new', {quiz: quiz});
        })
        .catch(function (error) {
            req.flash('error', 'Error al crear un  Quiz:' + error.message);
            next(error);
        });


};

// GET /quizzes/:quizId/edit
exports.edit = function (req, res, next) {

    res.render('quizzes/edit', {quiz: req.quiz});
};

// PUT /quizzes/:quizId
exports.update = function (req, res, next) {//Funcion que se encarga de actualizar los cambios
//que ha realizado el usuario en una pregunta
    req.quiz.question = req.body.question;//Recuperamos los valores del formulario
    req.quiz.answer = req.body.answer; //Y los metemos en la respuesta

    req.quiz.save({fields: ["question", "answer"]})//Guardamos los campos en la BBDD
        .then(function (quiz) {
            req.flash('success', 'Quiz editado con éxito');
            res.redirect('/quizzes/' + req.quiz.id);
        })
        .catch (Sequelize.ValidationError, function (error) {//Si algun cajetin esta vacio
            req.flash('error', 'Errores en el formulario:');
            for (var i in error.errors){
                req.flash('error', error.errors[i].value);
            }
            res.render('quizzes/edit', {quiz: req.quiz});//volvemos a mandar al usuario a edit
        })//Para que corrija los errores
        .catch(function (error) {
            req.flash('error', 'Error al editar el  Quiz:' + error.message);
            next(error);
        });
};

// DELETE /quizzes/:quizId
exports.destroy = function (req, res, next) {


    req.quiz.destroy()
    .then(function () {
        req.flash('success', 'Quiz borrado con éxito.');
        res.redirect('/goback');
    })
    .catch(function (error) {
        req.flash('error', 'Error al editar el Quiz: ' + error.message);
        next(error);
    });
};

   req.quiz.destroy()//Destruimos el quiz de la BBDD
       .then(function () {
           req.flash('success', 'Quiz borrado con exito.');
           res.redirect('/quizzes');//Volvemos al index de quizzes
       })
       .catch(function (error) {
           req.flash('error', 'Error al borrar el Quiz' + error.message);
           next(error);
       });



};

// GET /quizzes/:quizId/play
exports.play = function (req, res, next) {

    var answer = req.query.answer || ''; //Recuperamos la respuesta introducida por el usuario
    res.render('quizzes/play', {
            quiz: req.quiz,
            answer: answer
        });

};


// GET /quizzes/:quizId/check
exports.check = function (req, res, next) {

    var answer = req.query.answer || "";

    var result = answer.toLowerCase().trim() === req.quiz.answer.toLowerCase().trim();//Si el usuario acierta -> true

    res.render('quizzes/result', {
            quiz: req.quiz,
            result: result,
            answer: answer
        });

};



// GET /quizzes/randomplay
exports.randomplay = function (req, res, next) {

    if(req.session.randomplay){
        if(req.session.randomplay.resolved){
            var used = req.session.randomplay.resolved.length ? req.session.randomplay.resolved:[-1];
        } else {
            var aux = []
            req.session.randomplay.resolved=aux;
        }
    } else {
        var auxplay={};
        req.session.randomplay=auxplay;
        var aux = []
        req.session.randomplay.resolved=aux;

    }

    var used = req.session.randomplay.resolved.length ? req.session.randomplay.resolved:[-1];
    var whereopt = {'id': {$notIn: used}};
    models.Quiz.count()
        .then(function (count) {
            if(count===used.length){
                var score = req.session.randomplay.resolved.length;
                req.session.randomplay.resolved=[];
                res.render('quizzes/random_none', {score:score});
                next();
            }
            var max = count - req.session.randomplay.resolved.length-1;
            var aleatorio = Math.round(Math.random()*max);
            var findOptions = {
                where: whereopt,
                offset: aleatorio,
                limit: 1
            };
            return models.Quiz.findAll(findOptions);
        })
        .then(function (quiz) {

            res.render('quizzes/random_play', {
                quiz: quiz[0],
                score: req.session.randomplay.resolved.length
            });
        })
        .catch(function (error) {
            next(error);
        });

};

// GEt /quizzes/randomcheck
exports.randomcheck = function (req, res, next) {
    var answer = req.query.answer || "";
    var result = answer.toLowerCase().trim() === req.quiz.answer.toLowerCase().trim();//Si el usuario acierta -> true
    if(result){
        req.session.randomplay.resolved.push(parseInt(req.quiz.id));
    } else {
        req.session.randomplay.resolved=[];
    }


    res.render('quizzes/random_result', {
        score: req.session.randomplay.resolved.length,
        quizId: req.quiz.id,
        answer: answer,
        result: result
    });

};
/*//GET /quizzes/randomnone
exports.randomnone = function (req, res, next) {
    res.render('quizzes/random_none', {score:req.session.randomplay.resolved.length });
};*/
