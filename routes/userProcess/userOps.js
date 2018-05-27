var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var sha1 = require('sha1');
var con = require('../configuration/connection');


router.post('/registraionprocess', function(req, res, next) {
  var chkQry = "SELECT * FROM RD_USER_REGISTRATION WHERE ??=? OR ??=? OR ??=?";
	var cheQryData = ['MOBILE',req.body.mobile,'EMAIL',req.body.email,'USERNAME',req.body.username];
  chkQry = mysql.format(chkQry,cheQryData);
  con.query(chkQry, function(err, rows) {
    console.log(rows);
    if(rows.length<1){
      var newId = 'RDU000';
      var newIDQry = 'SELECT MAX(ID)+1 AS NEWID FROM RD_USER_REGISTRATION';
      con.query(newIDQry, function(wrong, id) {
        newId = newId+id[0].NEWID;
        var insertQry = 'INSERT INTO RD_USER_REGISTRATION(??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?)';
        var insertQryData = ['USERID','FIRST_NAME','MIDDLE_NAME','LAST_NAME','MOBILE','EMAIL','PROFILEPIC','USERNAME','PASSWORD','ACTIVE_STATUS', newId,req.body.firstname,req.body.middlename,req.body.lastname,req.body.mobile,req.body.email,req.body.picture, req.body.username,sha1(req.body.pwd),1];
        insertQry = mysql.format(insertQry,insertQryData);
        console.log(insertQry);
        con.query(insertQry, function(error, row) {
          if(error){
            res.json({ status: false, data: 'Problem with user creation. Try after sometime.' });
          }
          res.json({ status: true, data: 'User Registration Completed' });
        });
      });
    } else {
      res.json({ status: false, data: 'User Account Already Exist, Kindly Login' });
    }
  });
});

router.post('/loginprocess', function(req, res, next){
  var chkQry = "SELECT * FROM RD_USER_REGISTRATION WHERE ??=? OR ??=? AND ??=?";
	var cheQryData = ['EMAIL',req.body.loginparams,'MOBILE',req.body.loginparams,'PASSWORD',sha1(req.body.loginpassword)];
	chkQry = mysql.format(chkQry,cheQryData);
	console.log(chkQry);
	con.query(chkQry,function(errr,results){
		console.log(results);
		if(results.length>1){
			res.json({status: false, message: 'User Details exist more than one'});
		}else if(results.length == 0){
			res.json({status: false, message: 'User Details doesnot exist'});
		} else {
			delete(results[0].PASSWORD);
			res.json({status: true,message: 'User Login Successful',result: results[0]});
		}
	});
});

router.post('/forgotpassword', function(req, res, next){
  var chkQry = "SELECT * FROM RD_USER_REGISTRATION WHERE ??=? OR ??=?";
	var cheQryData = ['EMAIL',req.body.loginparams,'MOBILE',req.body.loginparams];
	chkQry = mysql.format(chkQry,cheQryData);
	console.log(chkQry);
	con.query(chkQry,function(errr,results){
		console.log(results);
		// if(results.length>1){
		// 	res.json({status: false, message: 'User Details exist more than one'});
		// }else if(results.length == 0){
		// 	res.json({status: false, message: 'User Details doesnot exist'});
		// } else {
		// 	delete(results[0].PASSWORD);
		// 	res.json({status: true,message: 'User Login Successful',result: results[0]});
		// }
	});
});



module.exports = router;
