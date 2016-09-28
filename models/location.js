'use strict';

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  address: String,
  city: String,
  country: String,
  coords: {type: [Number], index: '2dsphere'}
});

mongoose.model('Location', locationSchema);