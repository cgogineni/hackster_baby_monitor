var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 1;
var camInterval = 1000 / camFps;

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
      if (err) throw err;

      for (var i = 0; i < faces.length; i++) {
	    face = faces[i];
        im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], rectColor, rectThickness);
      }
       
      if (faces.length != 0) {
		   
		//Create clientside callback
		//Tether or stream option   
	    socket.emit('frame', { buffer: im.toBuffer() });
	    
      //Check wifi strength   
	    var sys = require('sys'),
	    spawn = require('child_process').spawn,
	    val = spawn('python', ["/home/root/hackster_baby_monitor/face-detection-node-opencv/server/lib/routes/wifi_strength_calc.py"]);
	    val.stdout.on('data', function(output) {
	    var temp = String(output);
	    var wifi_val  = parseInt(temp.substring(0,2));	
	    threshold1 = 50;
	    //threshold2 = 60;
	
        if(wifi_val < threshold1) {
		  //Send request to client: Baby is left inside car!!!
		  socket.emit('alert',{});
	    }
	  }  
    


	});	

      });
    });
  }, camInterval);
};
