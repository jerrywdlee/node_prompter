var os = require('os');//for ip reporter

//to read contents
var fs = require('fs');


//for http server
var	express = require('express'),
    app = express();
//router very very important
var index_router = express.Router();


//to set ip
var all_ip = {};


//set ejs as view
app.set('view options', { layout: false });
app.set('view engine', 'ejs');
var port = 8080;
app.listen(port);

app.get("/", function(req, res){
  res.render('index.ejs', { 
  						title:  'New Device',
			            server_url:  all_ip});
  //console.log(all_ip);
});
//must send other js for QR generater
app.get('/js/qrcode.min.js', function(req, res) {
	//must be "sendFile" and use __dirname or comes waring
    res.sendFile(__dirname +'/views/js/qrcode.min.js');  
});

app.use("/viewer",function(req, res){
	var my_text = fs.readFileSync('./contents/text.txt', 'utf8')
	res.render("viewer.ejs",{contents: my_text});
})


//ip getter
console.log("Please connect to :");
var ifaces = os.networkInterfaces();
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + alias, iface.address + ':' + port);
      console.log(iface.address + ':' + port)

    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address+ ':' + port);
      all_ip[ifname] = "http://"+iface.address+ ':' + port;
      //console.log(iface.address + ':' + port)
    }
    ++alias;
  });
});