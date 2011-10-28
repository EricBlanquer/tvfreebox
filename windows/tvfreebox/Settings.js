var checkOptTimeout;
var zoomTimeout;
var zoomTimeoutDelay = 500;

function checkOptions() {
	resetOptionsMessages();
	var boitier = document.getElementById('boitier').value;
	var code = document.getElementById('code').value;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://hd' + boitier + '.freebox.fr/pub/remote_control?code=' + code + '&key=start&a=' + Math.random(), true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState==4) {
			clearTimeout(checkOptTimeout);
			if(xhr.status!=0) resetOptionsMessages();
			if(xhr.status==200) {
				document.getElementById('opt_mess_ok').style.display = '';
			} else if(xhr.status==403) {
				document.getElementById('opt_mess_code').style.display = '';
			} else if(xhr.status==404) {
				document.getElementById('opt_mess_version').style.display = '';
			}
		}
	};
	checkOptTimeout = setTimeout(checkOptionsFailed, 3000);
	xhr.send();
}

function checkOptionsFailed() {
	document.getElementById('opt_mess_timeout').style.display = '';
}

function resetOptionsMessages() {
	document.getElementById('opt_mess_ok').style.display = 'none';
	document.getElementById('opt_mess_code').style.display = 'none';
	document.getElementById('opt_mess_version').style.display = 'none';
	document.getElementById('opt_mess_timeout').style.display = 'none';
}

function setSettings() {
	validateZoom($('#zoom')[0], 'btnZoomIn', 'btnZoomOut');
	System.Gadget.Settings.write('version', $('input[name=version]:checked').val());
	System.Gadget.Settings.write('boitier', $('#boitier').val());
	System.Gadget.Settings.write('code',    $('#code').val());
	System.Gadget.Settings.write('help',    $('#help:checked').length);
	System.Gadget.Settings.write('zoom',    $('#zoom').val());
}

function checkZoom(input) {
	var val = Math.round(input.value);
	if(isNaN(val)) {
		input.value = input.getAttribute('oldValue');
		input.select();
	} else {
		input.setAttribute('oldValue', val);
		input.style.backgroundColor = Number(val)<200 ? 'red' : '';
	}
}

function validateZoom(input, btnZoomInId, btnZoomOutId) {
	var val = Math.round(input.value);
	if(isNaN(val) || val<200) {
		input.value = 200;
		input.style.backgroundColor = '';
	}
	if(input.value>=9900) {
		document.getElementById(btnZoomInId).setAttribute('disabled', 'disabled');
		resetZoomTimeout();
	} else document.getElementById(btnZoomInId).removeAttribute('disabled');
	if(input.value<=200) {
		document.getElementById(btnZoomOutId).setAttribute('disabled', 'disabled');
		resetZoomTimeout();
	} else document.getElementById(btnZoomOutId).removeAttribute('disabled');
}

function setZoomIn(btnZoomIn, id, btnZoomOutId) {
	var input = document.getElementById(id);
	input.value = 100*(Math.floor(Number(input.value)/100)+1);
	validateZoom(input, btnZoomIn.id, btnZoomOutId);
}

function setZoomOut(btnZoomOut, id, btnZoomInId) {
	var input = document.getElementById(id);
	input.value = 100*(Math.ceil(Number(input.value)/100)-1);
	validateZoom(input, btnZoomInId, btnZoomOut.id);
}

function doOnZoomIn(btnZoomIn, id, btnZoomOutId) {
	clearTimeout(zoomTimeout);
	setZoomIn(btnZoomIn, id, btnZoomOutId);
	if(document.getElementById(id).value<9900) {
		zoomTimeout = setTimeout('doOnZoomIn(document.getElementById(\'' + btnZoomIn.id + '\'), \'' + id + '\', \'' + btnZoomOutId + '\');', zoomTimeoutDelay);
		zoomTimeoutDelay = 100;
	}
}

function doOnZoomOut(btnZoomOut, id, btnZoomInId) {
	clearTimeout(zoomTimeout);
	setZoomOut(btnZoomOut, id, btnZoomInId);
	if(document.getElementById(id).value>200) {
		zoomTimeout = setTimeout('doOnZoomOut(document.getElementById(\'' + btnZoomOut.id + '\'), \'' + id + '\', \'' + btnZoomInId + '\');', zoomTimeoutDelay);
		zoomTimeoutDelay = 100;
	}
}

function resetZoomTimeout() {
	clearTimeout(zoomTimeout);
	zoomTimeoutDelay = 500;
}

$(document).ready(function(){
	System.Gadget.onSettingsClosing = function(event){ if(event.closeAction==event.Action.commit) setSettings(); }
	$('#code').val(System.Gadget.Settings.read('code'));
	$('input[name=version][value=' + System.Gadget.Settings.read('version') + ']').attr('checked', 'checked');
	$('#boitier').val(System.Gadget.Settings.read('boitier'));
	if(System.Gadget.Settings.read('help')=='0') $('#help').removeAttr('checked');
	else $('#help').attr('checked', 'checked');
	var zoom = System.Gadget.Settings.read('zoom');
	if(!zoom) zoom = 500;
	document.getElementById('zoom').value = zoom;
	$(document).mouseup(resetZoomTimeout);
});