'use strict';

const request = require('request');
const Q = require('q');

module.exports = function(req, res) {

  Q.fcall(getData)
    .then(function(data) {
      data = data.map( (addr) => getCoords(addr) );
      return Q.all(data);
    })
    .then(function(data) {
      res.render('index', { title: 'Express', content: data });
    })
    .catch(function(err) {
      // error handling
      console.log(err);
      res.render('error', { message: err.message, error: err });
    });
}

function getData(url) {
  
  url = url || 'http://demo.beaver-mysql-logger.com/cities.json';
  let defer = Q.defer();
  
  request(url, function(err, response, body) {
    if (err) {
      defer.reject(new Error(err));
    } else {
      defer.resolve(JSON.parse(body));
    }
  });

  return defer.promise;

}

function getCoords(addressObj) {

  const addr = formatAddress(addressObj);

  const opt = {
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    method: 'GET',
    qs: {
      key: process.env.GOOGLE_API_KEY,
      address: addr
    }
  }

  let defer = Q.defer();

  request(opt, function(err, response, body) {
    if (err) {
      defer.reject(new Error(err));
    } else {
      body = JSON.parse(body);
      addressObj.location = body['results'][0]['geometry']['location'];
      defer.resolve(addressObj);
    }
  });

  return defer.promise;

}

function formatAddress(addresObj) {

  return addresObj.address.replace(/\s/g, '+') + ',+'
         + addresObj.city.replace(/\s/g, '+') + ',+'
         + addresObj.country.replace(/\s/g, '+');

}