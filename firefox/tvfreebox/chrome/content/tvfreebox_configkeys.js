var tvfreebox_configkeys = {
	//debug: true,
	labels: { 8: 'Retour', 9: 'Tabulation', 13: 'Entrée', 16: 'Shift', 17: 'Ctrl', 18: 'Alt', 19: 'Pause', 20: 'Caps lock', 27: 'Echape', 32: 'Espace', 33: 'Page haut', 34: 'Page bas', 35: 'Fin', 36: 'Début', 37: 'Fléche gauche', 38: 'Fléche haut', 39: 'Fléche droite', 40: 'Fléche bas', 45: 'Insertion', 46: 'Suppression', 59: '$', 91: 'Commande gauche', 92: 'Commande droite', 93: 'Menu contextuel', 96: 'Pavé num. 0', 97: 'Pavé num. 1', 98: 'Pavé num. 2', 99: 'Pavé num. 3', 100: 'Pavé num. 4', 101: 'Pavé num. 5', 102: 'Pavé num. 6', 103: 'Pavé num. 7', 104: 'Pavé num. 8', 105: 'Pavé num. 9', 106: 'Pavé num. *', 107: 'Pavé num. +', 109: 'Pavé num. -', 111: 'Pavé num. /', 112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6', 118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12', 145: 'Arrêt Défil', 172: 'Accueil', 173: 'Couper son', 174: 'Volume -', 175: 'Volume +', 177: 'Précédent', 179: 'Lecture', 180: 'Messagerie', 181: 'Media', 188: ',', 190: ';', 191: ':', 192: 'ù', 219: ')', 220: '*', 221: '^', 222: '²', 223: '!', 226: '<' },
	labelsFR: { power: 'Alimentation', tv: 'AV/TV', list: 'Liste', red: 'Rouge', yellow: 'Jaune', green: 'Vert', blue: 'Bleu', back: 'Retour', swap: 'Swap', info: 'Info', mail: 'Message', help: 'Aide', pip: 'PIP', vol_inc: 'Volume Plus', vol_dec: 'Volume Moins', up: 'Haut', down: 'Bas', left: 'Gauche', right: 'Droite', ok: 'OK', prgm_inc: 'Programme Plus', prgm_dec: 'Programme Moins', mute: 'Couper le son', bwd: 'Ralentir', prev: 'Précédent', rec: 'Enregistrement', fwd: 'Accélérer', next: 'Suivant', play: 'Lecture', stop: 'Stop', home: 'Free', padUp: 'pad Haut', padDown: 'pad Bas', padLeft: 'pad Gauche', padRight: 'pad Droite' },
	pressKey: function(key) {
		tvfreebox_configkeys.myDump('pressKey ' + key);
		var cdes = [];
		tvfreebox_configkeys.useShiftOnly = void(0);
		tvfreebox_configkeys.useCtrlOnly = void(0);
		tvfreebox_configkeys.useAltOnly = void(0);
		if(key) {
			for(var type in tvfreebox_configkeys.keys) {
				for(var code in tvfreebox_configkeys.keys[type]) {
					var typecode = type + ',' + code;
					if(tvfreebox_configkeys.keys[type][code].split(',')[0]==key) {
						cdes.push(typecode);
					}
					if(code==16) tvfreebox_configkeys.useShiftOnly = typecode;
					else if(code==17) tvfreebox_configkeys.useCtrlOnly = typecode;
					else if(code==18) tvfreebox_configkeys.useAltOnly = typecode;
				}
			}
			var label = document.getElementById('keys_config_label');
			var labelFR = tvfreebox_configkeys.labelsFR[key];
			var keyLabel = labelFR ? labelFR : key;
			label.setAttribute('value', 'Configuration de la touche ' + keyLabel);
		} else document.getElementById('keys_config_label').setAttribute('value', '');
		document.getElementById('label_output').style.display = 'none';
		var label_shift = document.getElementById('label_shift');
		var label_ctrl = document.getElementById('label_ctrl');
		var label_alt = document.getElementById('label_alt');
		if(tvfreebox_configkeys.useShiftOnly) {
			label_shift.style.display =  '';
			if(label!=keyLabel) label_shift.value = 'Shift est déjà attribuée pour la touche ' + tvfreebox_configkeys.getLabel(tvfreebox_configkeys.useShiftOnly);
			else label_shift.style.display = 'none';
		} else label_shift.style.display = 'none';
		if(tvfreebox_configkeys.useCtrlOnly) {
			label_ctrl.style.display =  '';
			if(label!=keyLabel) label_ctrl.value = 'Ctrl est déjà attribuée pour la touche ' + tvfreebox_configkeys.getLabel(tvfreebox_configkeys.useCtrlOnly);
			else label_ctrl.style.display = 'none';
		} else label_ctrl.style.display = 'none';
		if(tvfreebox_configkeys.useAltOnly) {
			label_alt.style.display =  '';
			if(label!=keyLabel) label_alt.value = 'Alt est déjà attribuée pour la touche ' + tvfreebox_configkeys.getLabel(tvfreebox_configkeys.useAltOnly);
			else label_alt.style.display = 'none';
		} else label_alt.style.display =  'none';
		var zone = document.getElementById('keys_config');
		zone.style.display = key ? '' : 'none';
		while(zone.childNodes.length>1) { zone.removeChild(zone.lastChild); }
		if(key) {
			var addrow = document.createElement('row');
			addrow.style.borderBottom = '1px dotted #666666';
			addrow.style.marginBottom = '10px';
			addrow.style.paddingBottom = '10px';
			var addcheckbox1 = document.createElement('checkbox');
			addcheckbox1.setAttribute('id', 'useShift');
			if(tvfreebox_configkeys.useShiftOnly) addcheckbox1.setAttribute('disabled', 'true');
			addcheckbox1.onclick = function(e) { tvfreebox_configkeys.setTouche(e, this); };
			addrow.appendChild(addcheckbox1);
			var addcheckbox2 = document.createElement('checkbox');
			addcheckbox2.setAttribute('id', 'useCtrl');
			if(tvfreebox_configkeys.useCtrlOnly) addcheckbox2.setAttribute('disabled', 'true');
			addcheckbox2.onclick = function(e) { tvfreebox_configkeys.setTouche(e, this); };
			addrow.appendChild(addcheckbox2);
			var addcheckbox3 = document.createElement('checkbox');
			addcheckbox3.setAttribute('id', 'useAlt');
			if(tvfreebox_configkeys.useAltOnly) addcheckbox3.setAttribute('disabled', 'true');
			addcheckbox3.onclick = function(e) { tvfreebox_configkeys.setTouche(e, this); };
			addrow.appendChild(addcheckbox3);
			var addtextbox1 = document.createElement('textbox');
			addtextbox1.onkeyup = function(e) { tvfreebox_configkeys.setTouche(e, this); };
			addtextbox1.onchange = function(e) { tvfreebox_configkeys.setTouche(e, this); };
			addtextbox1.setAttribute('id', 'touche');
			addtextbox1.setAttribute('name', 'touche');
			addtextbox1.setAttribute('size', '1');
			addtextbox1.setAttribute('maxlength', '1');
			addtextbox1.setAttribute('readonly', 'true');
			addtextbox1.setAttribute('key', key);
			addrow.appendChild(addtextbox1);
			var addtextbox2 = document.createElement('textbox');
			//addtextbox2.onchange = function(e) { tvfreebox_configkeys.setTouche(e, this); };
			addtextbox2.setAttribute('id', 'repeat');
			addtextbox2.setAttribute('type', 'number');
			addtextbox2.setAttribute('min', '1');
			addtextbox2.setAttribute('max', '32');
			addtextbox2.setAttribute('decimalplaces', '0');
			addtextbox2.setAttribute('size', '1');
			addtextbox2.setAttribute('maxlength', '1');
			addtextbox2.setAttribute('value', 1);
			addrow.appendChild(addtextbox2);
			var addbox = document.createElement('vbox');
			var addimage = document.createElement('image');
			addimage.setAttribute('src', 'chrome://tvfreebox/skin/global/add.png');
			addimage.style.marginTop = '5px';
			addimage.style.cursor = 'pointer';
			addimage.onclick = function() { tvfreebox_configkeys.addTouche(this); };
			addbox.appendChild(addimage);
			addrow.appendChild(addbox);
			zone.appendChild(addrow);
			for(var i=0; i<cdes.length; i++) {
				var keyDatas = cdes[i].split(',');
				var touche = tvfreebox_configkeys.labels[keyDatas[1]];
				if(!touche) touche = String.fromCharCode(keyDatas[1]);
				var datas = tvfreebox_configkeys.keys[keyDatas[0]][keyDatas[1]].split(',');
				var row = document.createElement('row');
				row.setAttribute('data', cdes[i]);
				var checkbox1 = document.createElement('checkbox');
				// checkbox1.onclick = function(e) { tvfreebox_configkeys.setTouche(e, this); };
				if(keyDatas[0]=='shift' && touche!='Shift') checkbox1.setAttribute('checked', 'true');
				/*if(tvfreebox_configkeys.useShiftOnly) */checkbox1.setAttribute('disabled', 'true');
				row.appendChild(checkbox1);
				var checkbox2 = document.createElement('checkbox');
				// checkbox2.onclick = function(e) { tvfreebox_configkeys.setTouche(e, this); };
				if(keyDatas[0]=='ctrl' && touche!='Ctrl') checkbox2.setAttribute('checked', 'true');
				/*if(tvfreebox_configkeys.useCtrlOnly) */checkbox2.setAttribute('disabled', 'true');
				row.appendChild(checkbox2);
				var checkbox3 = document.createElement('checkbox');
				// checkbox3.onclick = function(e) { tvfreebox_configkeys.setTouche(e, this); };
				if(keyDatas[0]=='alt' && touche!='Alt') checkbox3.setAttribute('checked', 'true');
				/*if(tvfreebox_configkeys.useAltOnly) */checkbox3.setAttribute('disabled', 'true');
				row.appendChild(checkbox3);
				var textbox1 = document.createElement('textbox');
				//textbox1.onkeyup = function(e) { tvfreebox_configkeys.setTouche(e, this); };
				//textbox1.onchange = function(e) { tvfreebox_configkeys.setTouche(e, this); };
				textbox1.setAttribute('name', 'touche');
				textbox1.setAttribute('size', '1');
				textbox1.setAttribute('maxlength', '1');
				textbox1.setAttribute('readonly', 'true');
				textbox1.setAttribute('value', touche);
				textbox1.setAttribute('tooltiptext', touche);
				row.appendChild(textbox1);
				var textbox2 = document.createElement('textbox');
				//textbox2.onchange = function(e) { tvfreebox_configkeys.setTouche(e, this); };
				textbox2.setAttribute('type', 'number');
				textbox2.setAttribute('min', '1');
				textbox2.setAttribute('max', '32');
				textbox2.setAttribute('decimalplaces', '0');
				textbox2.setAttribute('size', '1');
				textbox2.setAttribute('maxlength', '1');
				textbox2.setAttribute('readonly', 'true');
				textbox2.setAttribute('value', datas.length>1 ? datas[1] : 1);
				row.appendChild(textbox2);
				var box = document.createElement('vbox');
				var image = document.createElement('image');
				image.setAttribute('src', 'chrome://tvfreebox/skin/global/delete.png');
				image.style.marginTop = '5px';
				image.style.cursor = 'pointer';
				image.onclick = function(e) { tvfreebox_configkeys.deleteTouche(e, this); };
				box.appendChild(image);
				row.appendChild(box);
				zone.appendChild(row);
			}
		}
	},
	getLabel: function(datas) {
		tvfreebox_configkeys.myDump('getLabel');
		var keyDatas = datas.split(',');
		var label = tvfreebox_configkeys.keys[keyDatas[0]][keyDatas[1]].split(',')[0];
		var labelFR = tvfreebox_configkeys.labelsFR[label];
		if(labelFR) label = labelFR;
		return label;
	},
	addTouche: function(img) {
		tvfreebox_configkeys.myDump('addTouche');
		var touche  = document.getElementById('touche');
		var keycode = touche.getAttribute('keycode');
		if(keycode) {
			var useShift = document.getElementById('useShift').checked || keycode==16;
			var useCtrl  = document.getElementById('useCtrl').checked || keycode==17;
			var useAlt   = document.getElementById('useAlt').checked || keycode==18;
			var repeat   = Number(document.getElementById('repeat').value);
			var type = '';
			if(useShift) type += 'shift';
			if(useCtrl)  type += 'ctrl';
			if(useAlt)   type += 'alt';
			if(type=='') type = 'normal';
			var key = touche.getAttribute('key');
			if(!tvfreebox_configkeys.keys[type]) tvfreebox_configkeys.keys[type] = {};
			tvfreebox_configkeys.keys[type][keycode] = key + (repeat!=1 ? ',' + repeat : '');
			tvfreebox_configkeys.setKeysInPrefs();
			tvfreebox_configkeys.pressKey(key);
		}
	},
	isEmpty: function(object) {
		tvfreebox_configkeys.myDump('isEmpty');
		var result = true;
		if(typeof(object)==typeof({})) {
			for(var obj in object) {
				result = false;
			}
		}
		return result;
	},
	deleteTouche: function(event, element) {
		tvfreebox_configkeys.myDump('deleteTouche');
		while(element.nodeName.toLowerCase()!='row') { element = element.parentNode; }
		var keyDatas = element.getAttribute('data').split(',');
		var key = tvfreebox_configkeys.keys[keyDatas[0]][keyDatas[1]];
		delete(tvfreebox_configkeys.keys[keyDatas[0]][keyDatas[1]]);
		if(tvfreebox_configkeys.isEmpty(tvfreebox_configkeys.keys[keyDatas[0]])) {
			delete(tvfreebox_configkeys.keys[keyDatas[0]]);
		}
		element.parentNode.removeChild(element);
		tvfreebox_configkeys.setKeysInPrefs();
		tvfreebox_configkeys.pressKey(key.split(',')[0]);
	},
	setTouche: function(event, element) {
		tvfreebox_configkeys.myDump('setTouche');
		var touche, code;
		var myElement = element;
		if(myElement.getAttribute('name')=='touche') {
			code = event.keyCode;
			while(myElement.nodeName.toLowerCase()!='row') { myElement = myElement.parentNode; }
			var checkboxs = myElement.getElementsByTagName('checkbox');
			var type = '';
			if(checkboxs[0].checked) type += 'shift';
			if(checkboxs[1].checked) type += 'ctrl';
			if(checkboxs[2].checked) type += 'alt';
			if(type=='') type = 'normal';
			tvfreebox_configkeys.myDump(code + ', ' + type);
			if(!tvfreebox_configkeys.keys[type]) tvfreebox_configkeys.keys[type] = {};
			var data = myElement.getAttribute('data');
			if(data && !code) code = data.split(',')[1];
			if(code) touche = tvfreebox_configkeys.keys[type][code];
			var label_output = document.getElementById('label_output');
			if(touche) {
				var label = touche.split(',')[0];
				var labelFR = tvfreebox_configkeys.labelsFR[touche];
				if(labelFR) label = labelFR;
				label_output.style.display = '';
				label_output.value = 'Déjà attribuée pour la touche ' + label;
				element.value = '';
			} else if((tvfreebox_configkeys.useShiftOnly || tvfreebox_configkeys.keys['shift'] && !tvfreebox_configkeys.isEmpty(tvfreebox_configkeys.keys['shift'])) && code==16 ||
					  (tvfreebox_configkeys.useCtrlOnly || tvfreebox_configkeys.keys['ctrl'] && !tvfreebox_configkeys.isEmpty(tvfreebox_configkeys.keys['ctrl'])) && code==17 ||
					  (tvfreebox_configkeys.useAltOnly || tvfreebox_configkeys.keys['alt'] && !tvfreebox_configkeys.isEmpty(tvfreebox_configkeys.keys['alt'])) && code==18) {
				element.value = '';
			} else {
				var label = tvfreebox_configkeys.labels[code];
				element.value = label ? label : String.fromCharCode(code);
				element.setAttribute('keycode', code);
				label_output.style.display = 'none';
			}
		} else {
			var input = document.getElementById('touche');
			input.value = '';
			input.removeAttribute('keycode');
		}
	},
	setKeysInPrefs: function() {
		tvfreebox_configkeys.myDump('setKeysInPrefs');
		document.getElementById('keys').value = JSON.stringify(tvfreebox_configkeys.keys);
	},
	setZoom: function(version, height) {
		tvfreebox_configkeys.myDump('setZoom');
		if(isNaN(height)) height = 500;
		var zoom = height/(version=='v5' ? 2132 : 2580);
		for(var i=1; i<=2; i++) {
			var img = document.getElementById('tvfreebox-popup' + i + '-image-' + version);
			if(img) {
				if(height!=img.height) {
					img.height = height;
					img.width = Math.round((version=='v5' ? 565 : 654)*zoom);
				}
			}
		}
		var lst = document.getElementById(version + '-remoteURLmap').getElementsByTagName('html:area');
		for(var i=0; i<lst.length; i++) {
			var coords = lst[i].getAttribute('originaleCoords');
			if(!coords) {
				coords = lst[i].getAttribute('coords');
				lst[i].setAttribute('originaleCoords', coords);
			}
			coords = coords.split(',');
			for(var j=0; j<coords.length; j++) {
				coords[j] = coords[j]*zoom;
			}
			lst[i].setAttribute('coords', coords.join(','));
			lst[i].style.cursor = 'pointer';
		}
	},
	setTitle: function(enable) {
		tvfreebox_configkeys.myDump('setTitle');
		var areas = document.getElementsByTagName('html:area');
		for(var i=0; i<areas.length; i++) {
			var self = areas[i];
			self.style.cursor = 'pointer';
			if(enable) self.setAttribute('tooltiptext', self.getAttribute('title_bak'));
			else self.setAttribute('tooltiptext', '');
		}
	},
	displayNode: function(node) {
		tvfreebox_configkeys.myDump('displayNode');
		tvfreebox_configkeys.myDump(tvfreebox_configkeys.displayNode_(node));
	},
	myDump: function(aMessage) {
		if(tvfreebox_configkeys.debug) {
			var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
			consoleService.logStringMessage("tvfreebox_configkeys : " + aMessage);
		}
	},
	displayNode_: function(node, indent) {
		tvfreebox_configkeys.myDump('displayNode_');
		if(!indent) indent = 0;
		var spacer = '';
		for(var i=0; i<nodeName; i++) {
			spacer += ' ';
		}
		indent += 3;
		var txt = '';
		do {
			var nodeName = node.nodeName;
			txt += spacer + '<' + nodeName;
			for(var i=0; i<node.attributes.length; i++) {
				txt += ' ' + node.attributes[i].name + '="' + node.attributes[i].value + '"';
			}
			if(!node.childNodes.length) txt += '/>\n';
			else txt += '>\n' + tvfreebox_configkeys.displayNode_(node.firstChild, indent) + spacer + '</' + nodeName + '>\n';
			node = node.nextSibling;
		} while(node && indent!=3);
		return txt;
	},
	resetConfigKeys: function() {
		tvfreebox_configkeys.myDump('resetConfigKeys');
		document.getElementById('resetConfigKeyLink').style.visibility = 'hidden';
		var defaultprefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getDefaultBranch('extensions.tvfreebox.');
		tvfreebox_configkeys.keys = JSON.parse(defaultprefs.getComplexValue('keys', Components.interfaces.nsISupportsString).data);
		tvfreebox_configkeys.setKeysInPrefs();
		tvfreebox_configkeys.pressKey();
	},
	init: function() {
		tvfreebox_configkeys.myDump('init');
		try {
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('extensions.tvfreebox.');
			if(prefs.prefHasUserValue('keys')) document.getElementById('resetConfigKeyLink').style.visibility = 'visible';
			tvfreebox_configkeys.keys = JSON.parse(prefs.getComplexValue('keys', Components.interfaces.nsISupportsString).data);
			tvfreebox_configkeys.setZoom('v5', 500);
			tvfreebox_configkeys.setZoom('v6', 500);
			tvfreebox_configkeys.setTitle(true);
		} catch(e) {
			tvfreebox_configkeys.myDump(e);
		}
	}
};
window.addEventListener('load', tvfreebox_configkeys.init, false);