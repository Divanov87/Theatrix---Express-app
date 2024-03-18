const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const { SERVER_NAME, PORT } = require('./configs/envVariables');
const routes = require('./routes');
const { initDatabases } = require('./configs/initDatabases');
const { authHandler } = require('./middlewares/authMiddleware');
const cors = require("cors");

const app = express();

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', 'src/views');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static('public'));
app.use(cookieParser());
app.use(authHandler);
app.use(routes);

initDatabases()
    .then(() => {
        app.listen(PORT, () => console.log(`Server [${SERVER_NAME}] is listening @ http://127.0.0.1:${PORT}.. `));
    })
    .catch(err => console.error('Error Establishing a Database Connection!', err));


    // app.engine('.hbs', handlebars.engine({extname: '.hbs' , helpers: 
    // {
    //     formatDate: function(date) {
    //       if (!(date instanceof Date) || isNaN(date.getTime())) {
    //         return '';
    //       }
    //       const day = String(date.getDate()).padStart(2, '0');
    //       const month = String(date.getMonth() + 1).padStart(2, '0');
    //       const year = date.getFullYear();
    //       return `${day}.${month}.${year}`;
    //     },

    // // use in template like {{formatDate date}} with date set to Date object
    
    //      isEqual: function(value1, value2, options) {
    //     return (value1 === value2) ? options.fn(this) : options.inverse(this);
    //   }}
    // ));