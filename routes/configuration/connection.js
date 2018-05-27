var config = require('./config');
var mysql = require('mysql');


var connection = mysql.createConnection(config.development);

connection.connect(function(err) {
  if (err) {
      console.log('Connecting Error with Database');
      return;
  }
  console.log('Connecting with Database is Successfull');
});

module.exports = connection;
