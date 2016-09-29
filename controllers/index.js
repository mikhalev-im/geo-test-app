'use strict';

const Q = require('q');
const DataCollector = require('../models/dataCollector');
const mongoose = require('mongoose');

const Location = mongoose.model('Location');

module.exports = function(req, res) {

  Q.fcall(DataCollector.getData)
    .then(function(data) {
      
      data = data.map( (obj) => Location.findOneAndUpdate(obj, obj, {
        upsert: true,
        new: true 
      }) );
      
      return Q.all(data);
    })
    .then(function(data) {
      
      data = data.map( (addr) => {
        if (!addr.coords) {
          return DataCollector.getCoords(addr)
                  .then( (addr) => addr.save() );
        } else {
          return Q(addr);
        }
      });
      
      return Q.all(data);
    })
    .then(function(data) {
      res.render('index', { title: 'Тестовое задание', content: data });
    })
    .catch(function(err) {
      // error handling
      console.log(err);
      res.render('error', { message: err.message, error: err });
    });

}