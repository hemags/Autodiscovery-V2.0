var express = require('express');               //  ==> EXPRESS IN A VARIABLE. IT IS A FRAMEWORK WHICH HELPS YOUR FRONT-END LOOK BETTER     (http://expressjs.com/) 
var app = express();                            //  ==> ASSIGNING EXPRESS TO THIS APP VARIABLE      (http://expressjs.com/en/starter/hello-world.html)
var http = require('http').Server(app);         //  ==> BINDING EXPRESS WITH HTTP SERVER MODULE     (https://nodejs.org/api/http.html)
var io = require('socket.io')(http);            //  ==> BINDING HTTP INSTANCE WITH SOCKET IO FOR SERVER & CLIENT SIDE COMMUNICATION     (http://socket.io/)
var PythonShell = require('python-shell');      //  ==> PACKAGE TO EXECUTE PYTHON SCRIPTS       (https://www.npmjs.com/package/python-shell)
var fs = require('fs');                         //  ==> PACKAGE WHICH DEALS WITH FILES      (https://nodejs.org/api/fs.html)
var jsonfile = require('jsonfile');             //  ==> PACKAGE TO READ A JSON FILE     (https://www.npmjs.com/package/jsonfile)


//  APPLICATION START-UP DIRECTORY
//  ==============================

app.use(express.static(__dirname + '/public'));



//  PORT AT WHICH THE NODE APPLICATION LISTENS
//  ==========================================

var PORT = process.env.PORT || 80;
http.listen(PORT, function () {
  console.log('Server Started at Port = ' + PORT);
});




//  ROUTES FOR WEB PAGES (THIS IS FOR SECURITY REASONS)
//  ===================================================
// ==> LOGIN PAGE FOR ADHOC LOADER ( <SERVER-IP>:<PORT>/ EG: localhost:5000 )

app.get('/',function(req,res){
    res.sendfile('public/index.html'); 
});