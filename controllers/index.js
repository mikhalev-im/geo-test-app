'use strict';

const Q = require('q');
const DataCollector = require('../models/dataCollector');
const mongoose = require('mongoose');

const Location = mongoose.model('Location');

module.exports = function(req, res) {

  Q.fcall(DataCollector.getData)
    .then(function(data) {
      data = data.map( (addr) => DataCollector.getCoords(addr) );
      return Q.all(data);
    })
    // need to save data
    // then check if all have coords
    // get needed coords
    // render data
    .then(function(data) {
      res.render('index', { title: 'Express', content: data });
    })
    .catch(function(err) {
      // error handling
      console.log(err);
      res.render('error', { message: err.message, error: err });
    });

}