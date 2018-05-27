var express = require('express');
var router = express.Router();
var con = require('./configuration/connection');

// home page
router.get('/', function(req, res, next) {
  var query = 'SELECT * FROM RD_PRODUCTS';
  con.query(query, function(err, rows) {
      //console.log(rows);
      if (err) {
          console.log(err);
      }
      res.json({ status: true, data: rows });
  });

});

// edit page
router.get('/userEdit', function(req, res, next) {

    var id = req.query.id;
    //console.log(id);

    var db = req.con;
    var data = "";

    db.query('SELECT * FROM account WHERE id = ?', id, function(err, rows) {
        if (err) {
            console.log(err);
        }

        var data = rows;
        res.render('userEdit', { title: 'Edit Account', data: data });
    });

});


router.post('/userEdit', function(req, res, next) {

    var db = req.con;

    var id = req.body.id;

    var sql = {
        userid: req.body.userid,
        password: req.body.password,
        email: req.body.email
    };

    var qur = db.query('UPDATE account SET ? WHERE id = ?', [sql, id], function(err, rows) {
        if (err) {
            console.log(err);
        }

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/');
    });

});


router.get('/userDelete', function(req, res, next) {

    var id = req.query.id;

    var db = req.con;

    var qur = db.query('DELETE FROM account WHERE id = ?', id, function(err, rows) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});


module.exports = router;
