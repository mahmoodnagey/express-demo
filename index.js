const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./middleware/logger'); 
const home = require('./routes/home');
const courses = require('./routes/courses');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/', home);
app.use('/api/courses', courses); // tell express that for any routes start at /api/courses => use this router

// Configuration
console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);

// Enable Morgan Middleware function only in development environment
if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

app.use(logger);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port} ...`));

