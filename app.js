/**
 * Para empezar, instale
 * express bodyparser jsonwebtoken express-jwt
 * via npm
 * command :-
 * npm install express bodyparser jsonwebtoken express-jwt --save
 */

// Traer todas las dependencias en
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

// Instanciación de la aplicación express
const app = express();


// Ver el auth blog de react en el que se requiere el cors para el acceso
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

// Configurar bodyParser para usar json y configurarlo como req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Instanciación del middleware express-jwt
const jwtMW = exjwt({
    secret: 'keyboard cat 4 ever'
});


// MOCKING DB sólo para la prueba
let users = [
    {
        id: 1,
        username: 'jvg',
        password: 'root'
    },
    {
        id: 2,
        username: 'gio',
        password: 'prueba'
    }
];

// LOGIN ROUTE
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Utilice su lógica DB ORM aquí para encontrar al usuario y comparar la contraseña

    // Encuentra el primer nombre de usuario y contraseña que coinciden en la matriz de usuarios (asume que los nombres de usuario son únicos)
    var user = users.find(u => username == u.username && password == u.password);
    if (user) { // Las credenciales de usuario coinciden (son válidas)
        let token = jwt.sign({ id: user.id, username: user.username }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Firmando el token
        res.json({
            sucess: true,
            err: null,
            token
        });
    } else { // Las credenciales de usuario no coinciden (no son válidas) o no existe ningún usuario con este nombre de usuario/contraseña.
        res.status(401).json({
            sucess: false,
            token: null,
            err: 'Username or password is incorrect'
        });
    }
});

app.get('/', jwtMW /* Usando el express jwt MW aquí */, (req, res) => {
    res.send('You are authenticated'); // Envío de alguna respuesta cuando se autentica
});

// Tratamiento de errores
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') { // Enviar el error en lugar de mostrarlo en la consola
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});

// Iniciar la aplicación en PORT 3000
const PORT = 8080;
app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Magic happens on port ${PORT}`);
});