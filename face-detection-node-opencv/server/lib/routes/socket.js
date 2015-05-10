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

        socket.emit('frame', { buffer: im.toBuffer() });
	var sys = require('sys'),
	spawn = require('child_process').spawn,
	val = spawn('python', ["wifi_strength_calc.py"]);
	val.stdout.on('data', function(output) {
		var temp = String(output);
		console.log(temp);
		var fs = require('fs');
		fs.writeFile("/tmp/test", temp, function(err) {
		    if(err) {
		        return console.log(err);
		    }

		    console.log("The file was saved!");
		}); 

	});	

      });
    });
  }, camInterval);
};
