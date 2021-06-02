const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
var fs = require('fs');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition:{
        info:{
            title:"OAuth Test",
            description:"OAuth Test",
            contact: {
                name: "test"
              },
            servers:["http://localhost:5000"]
        }       
    },
    apis:["index.js"]
};
const swaggerDocs= swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(swaggerDocs));

const bodyParser = require('body-parser');
var secretKey = 'nGUhUR4C6AvmPZF';
var jsonParser = bodyParser.json();

const users =JSON.parse(fs.readFileSync('./users.json'));

// Routes
/**
 * @swagger
 * /app:
 *  get:
 *    description: Serve welcome Message
 *    responses:
 *      '200':
 *        description: welcome message
 */

app.get('/app', (req, res) => {
    res.json({
        message: 'Welcome'
    })
});

/**
 * @swagger
 * /app/login:
 *    post:
 *      description: Authenticates user, input userName and password , if user is valid a security token is returned which can be attached to further requests
 *    parameters:
 *      - name: user
 *        in: body
 *        description: User Name of user
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *              - userName
 *              - password
 *          properties:
 *              userName:
 *                  type: string
 *              password:
 *                  type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: welcome message
 */


app.post('/app/login', jsonParser,(req, res) => {
        console.log('authentication started');
        if (!!req.body) {
        if (!!req.body.userName && !!req.body.password) {
            let authArray = users.userList.filter(item => {
                if (item.userName == req.body.userName && item.password == req.body.password) {
                    return (true);
                }
                else {
                    return (false);
                }
            })
            if (authArray.length > 0) {
                jwt.sign(authArray[0], secretKey, (err, token) => {
                    res.json({
                        "token": token
                    })

                });
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.sendStatus(422);
        }
    }

    else {
        res.sendStatus(422)
    }
});


/**
 * @swagger
 * /app/requestInfo:
 *    post:
 *      description: provides sample output after authentication
 *    parameters:
 *      - name: token
 *        in: header
 *        description: token associated to user
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *              - token
 *          properties:
 *              token:
 *                  type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: welcome message
 */
app.post('/app/requestInfo', checkTokenExist, (req, res) => {
    jwt.verify(req.token, secretKey, (err, data) => {
        if (err) {
            res.sendStatus(403);
        }
        else {
            res.json({
                message: "authenticated Successfully"
            })
        }
    });
});


app.listen(5000, () => {
    console.log('Server started in port 5000');
});

function checkTokenExist(req, res, next) {
    const responseToken = req.headers['token'];
    if (!!responseToken) {
        req.token = responseToken;
        next();
    } else {

        res.sendStatus(403);
    }

}