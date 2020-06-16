const App = require('express')();
const { connect, connection } = require('mongoose');
const { urlencoded, json } = require('body-parser');
const morgan = require('morgan');

// Local functions and modules are imported here
const { onlineMongoBD } = require('./configs/app.config');
const userRoute = require('./routes/api/user');

// Configuring bodyparser for parsing data from body
App.use(urlencoded({ extended: false }));
App.use(json());

// setting up morgan for watch every request in console
App.use(morgan('dev'));

// Applying application routes
App.use('/api/v1/users', userRoute);

// Server and MongoDB configuration
const PORT = process.env.PORT || 4000;
const resolvedDepricatedWarning = { useNewUrlParser: true, useUnifiedTopology: true };

// MongoDB connection function which log and bind error to the console
const mongoDBConnectFunction = () => {
    connect(onlineMongoBD, resolvedDepricatedWarning);
    connection.on('error', console.error.bind(console, 'connection error:'));
    connection.once('open', () => {
        console.log(`MongoDB connected successfully...`);
    });
};

// Running application and logging errors
App.listen(PORT, () => {
    console.log(`Server listennig on port ${PORT}...`);
    mongoDBConnectFunction();
});
