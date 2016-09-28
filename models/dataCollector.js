'use strict';

const request = require('request');
const Q = require('q');

module.exports.getData = function(url) {
  
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

module.exports.getCoords = function(addressObj) {

  let defer = Q.defer();

  if (typeof addressObj != 'object') {
    defer.reject(new Error('Passing argument is not an object'));
  }

  const addr = formatAddress(addressObj);

  const opt = {
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    method: 'GET',
    qs: {
      key: process.env.GOOGLE_API_KEY,
      address: addr
    }
  }

  request(opt, function(err, response, body) {
    if (err) {
      defer.reject(new Error(err));
    } else {
      
      try {
        body = JSON.parse(body);
        addressObj.coords = body['results'][0]['geometry']['location'];
      } catch(err) {
        defer.reject(new Error(err));
      }

      defer.resolve(addressObj);
    }
  });

  return defer.promise;

}

function formatAddress(addressObj) {

  let res = '';

  addressObj.address 
    ? res += addressObj.address + ''
    : '';
  
  addressObj.city 
    ? res += addressObj.city + ' '
    : '';
  
  addressObj.country 
    ? res += addressObj.country 
    : '';

  return res.replace(/\s/g, '+');

}