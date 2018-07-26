/*jshint sub:true*/
var https = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var lti = require('ims-lti');
var _ = require('lodash');
var bodyParser  = require('body-parser');
  
var ltiKey = "DigitalHouse+CS1001+2018_01";
var ltiSecret = "SECRET";

app.engine('pug', require('pug').__express);


// app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug');

app.post('/launch_lti', function(req, res, next){
	console.log(req.body)
  	if (true || req.body['oauth_consumer_key']===ltiKey){
			// "test_lti_id:mykeyagain:mysagain"
  		var provider = new lti.Provider(ltiKey, ltiSecret);
  	   //Check is the Oauth  is valid.
  			provider.valid_request(req, function (err, isValid){
  				if (err) {
			      console.log('Error in LTI Launch:' + err);
			      res.status(403).send(err);
			      
  				}
  				else {
			      if (!isValid) {
			        console.log('\nError: Invalid LTI launch.');
			        res.status(500).send({ error: "Invalid LTI launch" });
			         } 
			      else {
		        	  //User is Auth so pass back when ever we need.
			    	  res.render('start', { title: 'LTI SETTINGS', CourseID: 'CourseID: '+req.body['context_id'], userID: 'UserID: '+req.body['user_id'], UserRole: 'Course Role: '+req.body['roles'], FulllogTitle: 'Full Log: ', Fulllog: JSON.stringify(req.body) });
			}}
	   });
	}
  else {
	  console.log('LTI KEY NOT MATCHED:');
	  res.status(403).send({ error: "LTI KEY NOT MATCHED" })
  }

});

app.get('/test', function(req, res, next){
	res.render('index', { title: 'Express'})

});

//Setup the http server
var server = https.createServer(app).listen(process.env.PORT || 5000, function(){
  console.log("https server started")
});



