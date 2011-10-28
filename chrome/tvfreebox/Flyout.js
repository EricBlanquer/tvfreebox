var keys;
var canSend = true;
var boitier, code, version, inpopup, popupwindow;
var key, isKeyPressed, keyPressTimeout, scrollWhellTimeout;
var directPress = ['vol_inc', 'vol_dec', 'prgm_inc', 'prgm_dec', 'up', 'down', 'left', 'right'];
var defaultkeys = {normal:{8:'back',13:'ok',20:'swap',27:'power',32:'0',33:'prgm_inc',34:'prgm_dec',35:'blue',36:'green',37:'left',38:'up',39:'right',40:'down',45:'red',46:'yellow',48:'2,5',49:'7,6',50:'3,5',51:'1,7',52:'1,6',54:'1,5',55:'3,6',65:'2',66:'2,2',67:'2,3',68:'3',69:'3,2',70:'3,3',71:'4',72:'4,2',73:'4,3',74:'5',75:'5,2',76:'5,3',77:'6',78:'6,2',79:'6,3',80:'7',81:'7,2',82:'7,3',83:'7,4',84:'8',85:'8,2',86:'8,3',87:'9',88:'9,2',89:'9,3',90:'9,4',93:'list',96:'0',97:'1',98:'2',99:'3',100:'4',101:'5',102:'6',103:'7',104:'8',105:'9',106:'prgm_inc',107:'vol_inc',109:'vol_dec',110:'1',111:'prgm_dec',188:'1,2',192:'8,5',222:'tv',223:'1,4'},shift:{27:'mute',48:'0,2',49:'1,8',50:'2,4',51:'3,4',52:'4,4',53:'5,4',54:'6,4',55:'7,5',56:'8,4',57:'9,5',87:'play',88:'stop',65:'bwd',66:'bwd',70:'fwd',77:'mute',78:'next',80:'prev',81:'prev',83:'next',82:'rec',90:'fwd',96:'0,2',97:'1,8',98:'2,4',99:'3,4',100:'4,4',101:'5,4',102:'6,4',103:'7,5',104:'8,4',105:'9,5',188:'info',190:'mail',191:'help',192:'play',220:'stop',223:'pip'},ctrl:{17:'home'}};
function contains(array, element) {
	for(var i = 0; i < array.length; i++) {
		if(array[i]==element) return true;
	}
	return false;
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
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://hd' + boitier + '.freebox.fr/pub/remote_control?code=' + code +
			'&key=' + key + (longPress ? '&long=true' : '') + (repeat ? '&repeat=' + repeat : '') + '&a=' + Math.random(), true);
		xhr.onreadystatechange = function() {
			if(xhr.readyState==4) canSend = true;
		}
		canSend = !isKeyPressed;
		xhr.send();
	}
	if(isKeyPressed && contains(directPress, key)) {
		keyPressTimeout = setTimeout('sendKey()', 100);
	} else key = void(0);
}
function doKeyDown(e){
	var t = e || window.event;
	var cde = t.keyCode;
	var shift = t.shiftKey;
	var alt = t.altKey;
	var ctrl = t.ctrlKey;
	var touche, nb;
	var type = '';
	if(shift) type += 'shift';
	if(ctrl)  type += 'ctrl';
	if(alt)   type += 'alt';
	if(type=='') type = 'normal';
	var keyData = keys[type] ? keys[type][cde] : void(0);
	if(typeof(keyData)!=typeof(void(0))) {
		var datas = keyData.split(',');
		touche = datas[0];
		nb = datas.length>1 ? Number(datas[1]) : 1;
	}
	if(!isKeyPressed && touche) {
		keyUp();
		isKeyPressed = true;
		key = touche;
		if(nb!=1) keyPressTimeout = setTimeout('sendKey(false, ' + nb + ');', 0);
		else keyPressTimeout = setTimeout('sendKey(' + contains(directPress, touche) + ', ' + nb + ')', 500);
	}
	return false;
}

function setTitle(enable){
	var areas = document.getElementsByTagName('area');
	for(var i=0; i<areas.length; i++) {
		var self = areas[i];
		self.style.cursor = 'pointer';
		if(enable) self.setAttribute('title', self.getAttribute('title_bak'));
		else self.setAttribute('title', '');
	}
}

function doOnMouseScroll(event){
	var wheelDelta = event.wheelDelta;
	if(wheelDelta) {
		clearTimeout(scrollWhellTimeout);
		scrollWhellTimeout = setTimeout('pressKey(\'' + (wheelDelta>0 ? 'vol_inc' : 'vol_dec') + '\');keyUp();', 0);
	}
}
function setZoom(version, height) {
	var img = document.getElementById(version + '-bodyBackground');
	if(height!=img.height) {
		var zoom = height/img.height;
		img.width = img.width * zoom;
		img.height = img.height * zoom;
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
function openPopup() {
	version = localStorage['version'];
	if(!version) version = 'v6';
	var img = document.getElementById(version + '-bodyBackground');
	var height = localStorage['zoom'];
	var width = Math.round(img.width * height / img.height);
	popupwindow = window.open('Flyout.html', 'tvfreebox', 'width=' + width + ',height=' + height + ',resizable=no,menubar=no,location=no,scrollbars=no,toolbar=no,status=no');
	setTimeout(function() {if(popupwindow.innerHeight<height && popupwindow.innerWidth==width) popupwindow.resizeTo(width + 35, height);}, 100);
}
function getSettings() {
	var userkeys = localStorage['keys'];
	keys = userkeys ? eval(userkeys)[0] : defaultkeys;
	version = localStorage['version'];
	if(!version) version = 'v6';
	chrome.browserAction.setIcon({'path': version + '.png'});
	if(version=='v5') {
		document.getElementById('v5-bodyBackground').style.display = '';
		document.getElementById('v6-bodyBackground').style.display = 'none';
	} else {
		document.getElementById('v5-bodyBackground').style.display = 'none';
		document.getElementById('v6-bodyBackground').style.display = '';
	}
	code = localStorage['code'];
	if(!code) code = '';
	boitier = localStorage['boitier'];
	if(!boitier) boitier = 1;
	setTitle(localStorage['help']!='0');
	var zoom = localStorage['zoom'];
	if(isNaN(zoom)) zoom = 600;
	setZoom(version, zoom);
	if(Number(zoom)>600) document.body.style.marginRight = '20px';
}
function init(e){
	if(localStorage['inpopup']!='1' || window.name=='tvfreebox') {
		document.onkeydown  = doKeyDown;
		document.onkeyup    = keyUp;
		window.onmousewheel = document.onmousewheel = doOnMouseScroll;
		getSettings();
	} else openPopup();
}