var currentWidth = window.innerWidth;
var currentHeight = window.innerHeight;
window.addEventListener('resize', function(e) {
	var width = e.target.innerWidth;
	var height = e.target.innerHeight;
	if (width != currentWidth) {
		currentWidth = width;
		currentHeight = Math.floor(width * 512 / 132);
		window.resizeTo(currentWidth, currentHeight);
	}
	else if (height != currentHeight) {
		if (height < 521) {
			height = 521;
		}
		currentHeight = height;
		currentWidth = Math.floor(height * 132 / 512);
		window.resizeTo(currentWidth, currentHeight);
	}
});

window.addEventListener('load', function() {
  var ip = '192.168.0.253';
  var finder = new ServiceFinder(function(opt_error) {
    if (opt_error) {
      return console.warn(opt_error);
    }
    if (!finder.found && finder.byService_._hid && finder.byService_._hid[ip]) {
		finder.found = true;
		var info = finder.byService_._hid[ip];
		var raw = new ArrayBuffer(keyboard_report_descriptor.length);
		var bufView = new Uint8Array(raw);
		for (var i = 0; i < keyboard_report_descriptor.length; i++) {
			bufView[i] = keyboard_report_descriptor[i];
		}
		chrome.sockets.udp.send(info.socketId, raw, ip, info.remotePort, function(sendInfo) {
			console.log(sendInfo);
		});
	}
  });
  /*
  var areas = document.getElementsByTagName('area');
  for (var i = 0; i < areas.length; i++) {
	areas[i].addEventListener('mouseup', keyUp);
	areas[i].addEventListener('mousedown', pressKey);
  }
  */
});

function pressKey(e) {
	var key = e.target.getAttribute('onmousedown');
	console.log('pressKey ', key);
}

function keyUp() {
	console.log('keyUp');
}
