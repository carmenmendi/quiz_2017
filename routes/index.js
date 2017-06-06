var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller')

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.randomplay){
        req.session.randomplay.resolved=[];
    }

    res.render('index');
});

// Pagina de creditos
router.get('/author', function(req, res, next) {
    if(req.session.randomplay){
        req.session.randomplay.resolved=[];
    }

    res.render('author');
});
/* GET ayuda */
router.get('/help', function(req, res, next) {
    if(req.session.randomplay){
        req.session.randomplay.resolved=[];
    }

    res.render('help');
});

//Autoload para rutas que usen :quizId
router.param('quizId', quizController.load);

//Definicion de rutas de /quizzes
router.get('/quizzes', quizController.index); //Cuando llega una peticion para quizcontroller
router.get('/quizzes/:quizId(\\d+)', quizController.show);//Cuando se pide ver una pregunta
router.get('/quizzes/new', quizController.new);//cuando se quiere crear un nuevo quiz
router.post('/quizzes', quizController.create);//Cuando se quiere subir un nuevo quiz
router.get('/quizzes/:quizId(\\d+)/edit', quizController.edit);//cuando se quiere editar un quizz
router.put('/quizzes/:quizId(\\d+)', quizController.update);
router.delete('/quizzes/:quizId(\\d+)', quizController.destroy); //Funcion de eliminar una pregunta

router.get('/quizzes/:quizId(\\d+)/play', quizController.play);//Se empieza a jugar
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);//Para comprobar si hemos acertado


//Definicion de rutas de random
router.get('/quizzes/randomplay', quizController.randomplay);
router.get('/quizzes/randomcheck/:quizId(\\d+)', quizController.randomcheck);
//router.get('/quizzes/randomnone', quizController.randomnone);


module.exports = router;
