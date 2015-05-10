

var isAlertBox = false;
var isStream = false;

/*
Function: validateIP()
Description: Attempt to connect to server/Intel IoT platform
* Manages all the server callback creations
*/

function validateIP() {
	console.log("starting");
	
    'use strict';
    var socket,
    //Get values from text fields
    //ip_addr = $("#ip_address").val(),
    ip_addr = "192.168.43.123",
    //port = $("#port").val(),
    port = "8080",
        
    script = document.createElement("script");

    //create script tag for socket.io.js file located on your IoT platform (development board)
    script.setAttribute("src", "http://" + ip_addr + ":" + port + "/socket.io/socket.io.js");
    document.head.appendChild(script);
    
    //Wait 1 second before attempting to connect
    setTimeout(function(){
    console.log("before try");
    try {
            // MODIFY THIS TO THE APPROPRIATE URL IF IT IS NOT BEING RUN LOCALLY
     
           //document.getElementById('submitbtn').style.display = "none";
           var socket = io.connect('http://192.168.43.123:8080');
           console.log("after io.connect");       
           window.location.assign("#select_box");

           socket.on('frame', function (data) {
				if(isStream ) {
					
					//Build image from stream
					var canvas = document.getElementById('stream_canvas');
				    var img = document.createElement("img");
				    var context = canvas.getContext('2d');
				
                // Reference: http://stackoverflow.com/questions/24107378/socket-io-began-to-s
                    var uint8Arr = new Uint8Array(data.buffer);
                    var str = String.fromCharCode.apply(null, uint8Arr);
                    var base64String = btoa(str);
                    console.log("inside socket.on");
                    img.onload = function () {
                       context.drawImage(this, 0, 0, canvas.width, canvas.height);
                    };
                    img.src = 'data:image/png;base64,' + base64String;
			   }
            });

			socket.on('alert',function(options) {
				if (!isAlertBox) {
				   console.log("ALERT");
				   window.location.assign("#baby_alone_alert"); 
				   navigator.notification.alert(
                "Your Baby Is Alone!",  // message
                "",                     // callback
                'Save The Baby!',            // title
                'Ok'                  // buttonName
            );
				}
					
				

			});
	    
			socket.on('tether',function(options) {
				//Render tethering
			
			});

            //Connect to Server
        } catch (e) {
            navigator.notification.alert(
                "Server Not Available!",  // message
                "",                     // callback
                'Connection Error!',            // title
                'Ok'                  // buttonName
            );
        }
    
    }, 1000);

}

function startStream() {
	
	var defaultPage = document.getElementById('default_container');
    defaultPage.style.display = "none";
    
    var videoPage = document.getElementById('video_container');
    videoPage.style.display = "block";
    
    var canvas = document.createElement('canvas');
    canvas.setAttribute("id", "stream_canvas");
    videoPage.appendChild(canvas);

    var context = canvas.getContext('2d');

    context.fillStyle = '#333';
    context.fillText('Loading...', canvas.width/2-30, canvas.height/3);
    
    isStream = true;
}



