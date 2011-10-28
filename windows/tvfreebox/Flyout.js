var canSend = true;
var boitier, code, version;
var key, isKeyPressed, keyPressTimeout, scrollWhellTimeout;
var directPress = ['vol_inc', 'vol_dec', 'prgm_inc', 'prgm_dec', 'up', 'down', 'left', 'right'];
function contains(array, element) {
	for(var i = 0; i < array.length; i++) {
		if(array[i]==element) return true;
	}
	return false;
}
function getSettings(){
	boitier = System.Gadget.Settings.read('boitier');
	version = System.Gadget.Settings.read('version');
	var $img = $('#' + version + '-bodyBackground');
	$img.show();
	$(document.body).width($img.attr('originalWidth')).height($img.attr('originalHeight'));
	if(!boitier || boitier=='') boitier = 1;
	code = System.Gadget.Settings.read('code');
	setTitle(System.Gadget.Settings.read('help')!='0');
	var zoom = System.Gadget.Settings.read('zoom');
	if(isNaN(zoom) || Number(zoom)<200) zoom = 500;
	setZoom(version, zoom);
}
function setZoom(version, height) {
	var $img = $('#' + version + '-bodyBackground');
	if(height!=$img.attr('originalHeight')) {
		var zoom = height/$img.attr('originalHeight');
		var newWidth = Math.round($img.attr('originalWidth')*zoom);
		$img.width(newWidth);
		$img.height(height);
		$(document.body).width(newWidth).height(height);
		var lst = document.getElementById(version + '-remoteURLmap').getElementsByTagName('area');
		for(var i=0; i<lst.length; i++) {
			var coords = lst[i].getAttribute('coords').split(',');
			for(var j=0; coord=coords[j]; j++) {
				coords[j] = coord*zoom;
			}
			lst[i].setAttribute('coords', coords.join(','));
		}
	}
}
function pressKey(keyPressed){
	isKeyPressed = true;
	key = keyPressed;
	keyPressTimeout = setTimeout('sendKey(' + (contains(directPress, keyPressed)  ? 'false' : 'true') + ');', 500);
}
function keyUp(){
	isKeyPressed = false;
	clearTimeout(keyPressTimeout);
	sendKey();
}
function sendKey(longPress, repeat){
	if(key && canSend && code) {
		$.ajax({
			  url: 'http://hd' + boitier + '.freebox.fr/pub/remote_control'
			, cache: false
			, data: 'code=' + code + '&key=' + key + (longPress ? '&long=true' : '') + (repeat ? '&repeat=' + repeat : '')
			, beforeSend: function(){ canSend = !isKeyPressed; }
			, complete:   function(){ canSend = true; }
		});
	}
	if(isKeyPressed && contains(directPress, key)) {
		keyPressTimeout = setTimeout('sendKey()', 100);
	} else key = void(0);
}
function doKeyDown(e){
    var t = e || window.event;
    var cde = t.keyCode;
	var shift = t.shiftKey;
	var touche, nb;
	if(!shift && cde>64 && cde<91){
		var pos = cde - 59 - Math.floor(cde / 83) - Math.floor(cde / 90);
		touche = Math.floor(pos/3).toString();
		nb = pos%3 + 1;
		if(cde==83 || cde==90) nb++;
	} else if(cde>95 && cde<106){
		touche = (cde - 96).toString();
		if(!shift) nb = 1;
		else if(cde==96) nb = 2;
		else if(cde==97) nb = 8;
		else if(cde==103 || cde==105) nb = 5;
		else nb = 4;
	} else if(shift && cde>47 && cde<58){
		touche = (cde - 48).toString();
		if(cde==48) nb = 2;
		else if(cde==49) nb = 8;
		else if(cde==55 || cde==57) nb = 5;
		else nb = 4;
	} else {
		nb = 1;
		if(shift){
			switch(cde){
				case  87:
				case 192: touche = 'play';     break;
				case  88:
				case 220: touche = 'stop';     break;
				case  65:
				case  66: touche = 'bwd';      break;
				case  70:
				case  90: touche = 'fwd';      break;
				case  80:
				case  81: touche = 'prev';     break;
				case  78:
				case  83: touche = 'next';     break;
				case  82: touche = 'rec';      break;
				case  27:
				case  77: touche = 'mute';     break;
				case 188: touche = 'info';     break;
				case 190: touche = 'mail';     break;
				case 191: touche = 'help';     break;
				case 223: touche = 'pip';      break;
			}
		} else {
			switch(cde){
				case   8: touche = 'back';     break;
				case  13: touche = 'ok';       break;
				case  17: touche = 'home';     break;
				case  20: touche = 'swap';     break;
				case  27: touche = 'power';    break;
				case  32: touche = '0';        break;
				case  35: touche = 'blue';     break;
				case  36: touche = 'green';    break;
				case  37: touche = 'left';     break;
				case  38: touche = 'up';       break;
				case  39: touche = 'right';    break;
				case  40: touche = 'down';     break;
				case  45: touche = 'red';      break;
				case  46: touche = 'yellow';   break;
				case  48: touche = '2';  nb=5; break;
				case  49: touche = '7';  nb=6; break;
				case  50: touche = '3';  nb=5; break;
				case  51: touche = '1';  nb=7; break;
				case  52: touche = '1';  nb=6; break;
				case  54: touche = '1';  nb=5; break;
				case  55: touche = '3';  nb=6; break;
				case  93: touche = 'list';     break;
				case 33:
				case 106: touche = 'prgm_inc'; break;
				case 107: touche = 'vol_inc';  break;
				case 109: touche = 'vol_dec';  break;
				case 110: touche = '1';        break;
				case 34:
				case 111: touche = 'prgm_dec'; break;
				case 188: touche = '1';  nb=2; break;
				case 192: touche = '8';  nb=5; break;
				case 222: touche = 'tv';       break;
				case 223: touche = '1';  nb=4; break;
			}
		}
	}
	if(!isKeyPressed && touche) {
		keyUp();
		isKeyPressed = true;
		key = touche;
		if(nb!=1) keyPressTimeout = setTimeout('sendKey(false, ' + nb + ');', 0);
		else keyPressTimeout = setTimeout('sendKey(' + contains(directPress, touche) + ', ' + nb + ')', 500);
	}
}
function setTitle(enable){
	$('area').each(function(){
		var self = $(this);
		if(enable) self.attr('title', self.attr('title_bak'));
		else self.removeAttr('title');
	});
}
function doOnMouseScroll(event){
	var wheelDelta = window.event.wheelDelta;
	if(wheelDelta) {
		clearTimeout(scrollWhellTimeout);
		scrollWhellTimeout = setTimeout('pressKey(\'' + (wheelDelta>0 ? 'vol_inc' : 'vol_dec') + '\');keyUp();', 0);
	}
}
$(document).ready(function(){
	document.onkeydown = doKeyDown;
	document.onkeyup   = keyUp;
	window.onmousewheel = document.onmousewheel = doOnMouseScroll;
	$('area').mouseover(function(){ $('#' + version + '-bodyBackground').css('cursor', 'pointer'); }).mouseout(function(){ $('#' + version + '-bodyBackground').css('cursor', 'default'); });
	getSettings();
});