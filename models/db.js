'use strict';

const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost/test';

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.Promise = require('q').Promise;

mongoose.connect(dbURI);

// log events
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});


// load schemas
require('./location');