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

app.get('/dashboard',function(req,res){
    res.sendfile('public/web_template/production/index3.html'); 
});


//	SOCKET.IO 	

io.on('connection', function (socket) {

	main()

	function main(){
		var file = 'python/data_files/raw.json'

		fs.readFile(file, 'utf8', function(err, contents) {
    
    		var jsoncontents = JSON.parse(contents.replace(/'/g,"\""));
    
    		socket.emit('process count', { process_count : jsoncontents["data"].length });
    		socket.emit('CPU usage', {cpu_usage : calculate_cpu(jsoncontents) });
    		socket.emit('RAM usage', {ram_usage : calculate_ram(jsoncontents) });
    		calculate_disk()
  	
  			socket.on('my other event', function (data) {
    			console.log(data);
  			});
		
		});
	}

	function callback(data1){
		socket.emit('Disk Space Usage', {disk_space_usage : data1 });
	}


	function calculate_disk(){
	var diskspace = require('diskspace');
	diskspace.check('/', function (err, total, free, status){
			var disk_val = 0.00;
			disk_val = (100-((free/total)*100));
			callback(disk_val.toFixed(2));
		});
	}



	function calculate_cpu(jsoncontents){
		var total_cpu = 0.0;
		for(var i=0; i<jsoncontents["data"].length; i++){
			total_cpu = total_cpu + parseFloat(jsoncontents["data"][i]["CPU"]);
		}
		return(total_cpu.toFixed(2));
	}


	function calculate_ram(jsoncontents){
		var total_ram = 0.0;
		for(var i=0; i<jsoncontents["data"].length; i++){
			total_ram = total_ram + parseFloat(jsoncontents["data"][i]["RAM"]);
		}
		return(total_ram.toFixed(2));
	}



});

