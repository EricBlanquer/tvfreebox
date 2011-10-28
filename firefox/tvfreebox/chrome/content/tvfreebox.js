var tvfreebox = {
	//debug: true,
	tvfreebox_version: '2.2.1',
	configid:     '0',
	popupvisible: false,
	isKeyPressed: false,
	canSend:      true,
	directPress:  ['vol_inc', 'vol_dec', 'prgm_inc', 'prgm_dec', 'up', 'down', 'left', 'right'],
	contains: function (array, element) {
		tvfreebox.myDump('contains ' + array + ', ' + element);
		for(var i = 0; i < array.length; i++) {
			if(array[i]==element) return true;
		}
		return false;
	},
	pressKey: function(keyPressed){
		tvfreebox.myDump('pressKey ' + keyPressed);
		tvfreebox.isKeyPressed = true;
		tvfreebox.key = keyPressed;
		tvfreebox.keyPressTimeout = setTimeout(tvfreebox.sendKey, 500, !tvfreebox.contains(tvfreebox.directPress, keyPressed), void(0));
	},
	keyUp: function(){
		tvfreebox.myDump('keyUp ');
		tvfreebox.isKeyPressed = false;
		if(tvfreebox.keyPressTimeout) clearTimeout(tvfreebox.keyPressTimeout);
		tvfreebox.sendKey();
	},
	sendKey: function(longPress, repeat){
		tvfreebox.myDump('sendKey ' + longPress + ', ' + repeat);
		if(tvfreebox.key && tvfreebox.canSend && tvfreebox.code) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'http://hd' + tvfreebox.boitier + '.freebox.fr/pub/remote_control?code=' + tvfreebox.code +
				'&key=' + tvfreebox.key + (longPress ? '&long=true' : '') + (repeat ? '&repeat=' + repeat : '') + '&a=' + Math.random(), true);
			xhr.onreadystatechange = function() {
				if(xhr.readyState==4) tvfreebox.canSend = true;
			};
			tvfreebox.canSend = !tvfreebox.isKeyPressed;
			xhr.send();
		}
		if((!repeat || repeat==1) && tvfreebox.isKeyPressed && tvfreebox.contains(tvfreebox.directPress, tvfreebox.key)) {
			tvfreebox.keyPressTimeout = setTimeout(tvfreebox.sendKey, 100, void(0), void(0));
		} else {
			tvfreebox.key = void(0);
			tvfreebox.isKeyPressed = false;
		}
	},
	doKeyDown: function(e) {
		tvfreebox.myDump('doKeyDown ' + e);
		if(!tvfreebox.popupvisible) return;
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
		var keyData = tvfreebox.keys[type] ? tvfreebox.keys[type][cde] : void(0);
		if(typeof(keyData)!=typeof(void(0))) {
			var datas = keyData.split(',');
			touche = datas[0];
			nb = datas.length>1 ? Number(datas[1]) : 1;
		}
		if(!tvfreebox.isKeyPressed && touche) {
			tvfreebox.keyUp();
			tvfreebox.isKeyPressed = true;
			tvfreebox.key = touche;
			if(nb!=1) tvfreebox.keyPressTimeout = setTimeout(tvfreebox.sendKey, 0, false, nb);
			else tvfreebox.keyPressTimeout = setTimeout(tvfreebox.sendKey, 500, tvfreebox.contains(tvfreebox.directPress, touche), nb);
		}
		return false;
	},
	setTitle: function(enable) {
		tvfreebox.myDump('setTitle ' + enable);
		var areas = document.getElementsByTagName('html:area');
		for(var i=0; i<areas.length; i++) {
			var self = areas[i];
			self.style.cursor = 'pointer';
			if(enable) self.setAttribute('tooltiptext', self.getAttribute('title_bak'));
			else self.setAttribute('tooltiptext', '');
		}
	},
	doOnMouseScroll: function(event) {
		tvfreebox.myDump('doOnMouseScroll ' + event);
		var detail = event.detail;
		if(tvfreebox.popupvisible && detail) {
			if(tvfreebox.scrollWhellTimeout) clearTimeout(tvfreebox.scrollWhellTimeout);
			tvfreebox.scrollWhellTimeout = setTimeout(tvfreebox.pressKey, 0, detail>0 ? 'vol_dec' : 'vol_inc');
			setTimeout(tvfreebox.keyUp, 0);
		}
	},
	setZoom: function(version, height) {
		tvfreebox.myDump('setZoom ' + version + ', ' + height);
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
			for(var j=0; coord=coords[j]; j++) {
				coords[j] = Math.round(coord*zoom);
			}
			lst[i].setAttribute('coords', coords.join(','));
		}
	},
	displayNode: function(node, indent) {
		tvfreebox.myDump('displayNode ' + node + ', ' + indent);
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
			for(var i=0; node.attributes && i<node.attributes.length; i++) {
				txt += ' ' + node.attributes[i].name + '="' + node.attributes[i].value + '"';
			}
			if(!node.childNodes.length) txt += '/>\n';
			else txt += '>\n' + tvfreebox.displayNode(node.firstChild, indent) + spacer + '</' + nodeName + '>\n';
			node = node.nextSibling;
		} while(node && indent!=3);
		return txt;
	},
	listConfig: function(menulist) {
		tvfreebox.myDump('listConfig ' + menulist);
		while(menulist.childNodes.length) menulist.removeChild(menulist.lastChild);
		if(!menulist.childNodes.length) {
			var menuitem = document.createElement('menuitem');
			menuitem.setAttribute('label', tvfreebox.label);
			menuitem.setAttribute('type', 'radio');
			menuitem.setAttribute('checked', 'true');
			menuitem.setAttribute('oncommand', 'tvfreebox.changeConfig(this);');
			var config = { configid: 0, label: tvfreebox.label, version: tvfreebox.version, boitier: tvfreebox.boitier, code: tvfreebox.code, zoom: tvfreebox.zoom, help: tvfreebox.help, showicon: tvfreebox.showicon };
			menuitem.setUserData('data-config', JSON.stringify(config), null);
			menulist.appendChild(menuitem);
			var configs = tvfreebox_options.getConfigs(tvfreebox.configs);
			for(var i=0; i<configs.length; i++) {
				var menuitem = document.createElement('menuitem');
				menuitem.setAttribute('label', configs[i].label);
				menuitem.setAttribute('type', 'radio');
				menuitem.setAttribute('oncommand', 'tvfreebox.changeConfig(this);');
				configs[i].configid = i+1;
				menuitem.setUserData('data-config', JSON.stringify(configs[i]), null);
				menulist.appendChild(menuitem);
			}
			var menuitem = document.createElement('menuitem');
			menuitem.setAttribute('label', 'Options');
			menuitem.setAttribute('type', 'checkbox');
			menuitem.setAttribute('oncommand', 'window.open(\'chrome://tvfreebox/content/options.xul\', \'Options\', \'chrome,modal,centerscreen\');');
			menulist.appendChild(menuitem);
		}
	},
	changeConfig: function(menuitem) {
		tvfreebox.myDump('changeConfig ' + menuitem);
		var config = JSON.parse(menuitem.getUserData('data-config'));
		if(config.configid!='0') {
			var configs = tvfreebox_options.getConfigs(tvfreebox.configs);
			var txtConfig = [];
			for(var i=0; i<configs.length; i++) {
				if(configs[i].configid==config.configid) {
					configs[i].label    = tvfreebox.label;
					configs[i].version  = tvfreebox.version;
					configs[i].boitier  = tvfreebox.boitier;
					configs[i].code     = tvfreebox.code;
					configs[i].zoom     = tvfreebox.zoom;
					configs[i].help     = tvfreebox.help;
					configs[i].showicon = tvfreebox.showicon;
				}
				configs[i].configid = i+1;
				txtConfig.push(configs[i]);
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('extensions.tvfreebox.');
			var pls = Components.classes["@mozilla.org/pref-localizedstring;1"].createInstance(Components.interfaces.nsIPrefLocalizedString);
			pls.data = '[' + txtConfig.join(',') + ']';
			prefs.setComplexValue('configs', Components.interfaces.nsIPrefLocalizedString, pls);
			pls.data = config.label;
			prefs.setComplexValue('label', Components.interfaces.nsIPrefLocalizedString, pls);
			prefs.setCharPref('version',  config.version);
			prefs.setCharPref('boitier',  config.boitier);
			prefs.setCharPref('code',     config.code);
			prefs.setCharPref('zoom',     config.zoom);
			prefs.setBoolPref('help',     config.help);
			prefs.setBoolPref('showicon', config.showicon);
			tvfreebox.init();
		}
	},
	myPrefObserver: {
		register: function() {
			tvfreebox.myDump('register ');
			var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			this._branch = prefService.getBranch("extensions.tvfreebox.");
			this._branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
			this._branch.addObserver("", this, false);
		},
		unregister: function() {
			tvfreebox.myDump('unregister ');
			if (!this._branch) return;
			this._branch.removeObserver("", this);
		},
		observe: function(aSubject, aTopic, aData) {
			tvfreebox.myDump('observe ');
			if(aTopic=="nsPref:changed") tvfreebox.init();
		}
	},
	myDump: function(aMessage) {
		if(tvfreebox.debug) {
			var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
			consoleService.logStringMessage("tvfreebox : " + aMessage);
		}
	},
	manageOldPrefs: function() {
		tvfreebox.myDump('manageOldPrefs ');
		try {
			var service = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);
			var old_prefs = service.getBranch('tvfreebox.');
			var new_prefs = service.getBranch('extensions.tvfreebox.');
			var oldPrefsCharKey = ['boitier', 'code', 'configs', 'label', 'version', 'zoom'];
			var oldPrefsBoolKey = ['help', 'showicon'];             
			for(var i=0; i<oldPrefsCharKey.length; i++) {
				if(old_prefs.prefHasUserValue(oldPrefsCharKey[i])) {
					var old_value = old_prefs.getCharPref(oldPrefsCharKey[i]);
					if(old_value!='') {
						new_prefs.setCharPref(oldPrefsCharKey[i], old_value);
						old_prefs.setCharPref(oldPrefsCharKey[i], '');
					}
				}
			}
			for(var i=0; i<oldPrefsBoolKey.length; i++) {
				if(old_prefs.prefHasUserValue(oldPrefsBoolKey[i]) && !old_prefs.getBoolPref(oldPrefsBoolKey[i])) {
					new_prefs.setBoolPref(oldPrefsBoolKey[i], false);
					old_prefs.setBoolPref(oldPrefsBoolKey[i], true);
				}
			}
		} catch(e) {}
	},
	updatePrefs2Json: function(prefs) {
		tvfreebox.myDump('updatePrefs2Json');
		var prefs2Update = ['keys', 'configs'];
		for(var i=0; i<prefs2Update.length; i++) {
			var data = prefs.getComplexValue(prefs2Update[i], Components.interfaces.nsISupportsString).data;
			if(prefs2Update[i]=='keys' && data.charAt(0)=='[') data = data.substring(1, data.length-1);
			if(data.indexOf('"')!=-1) continue;
			else data = data.replace(/\'/g, '"');
			var newData = '';
			while(data.indexOf(':')!=-1) {
				var datas = data.split(':');
				var keyPos = datas[0].lastIndexOf('{');
				if(keyPos==-1) keyPos = datas[0].lastIndexOf(',');
				var key = datas[0].substring(keyPos+1);
				if(key.charAt(0)!='"' && key.charAt(key.length-1)!='"') {
					key = '"' + key + '"';
				}
				newData += datas[0].substring(0, keyPos+1) + key + ':';
				data = datas.slice(1).join(':');
			}
			newData += data;
			var pls = Components.classes["@mozilla.org/pref-localizedstring;1"].createInstance(Components.interfaces.nsIPrefLocalizedString);
			pls.data = newData;
			prefs.setComplexValue(prefs2Update[i], Components.interfaces.nsIPrefLocalizedString, pls);
		}
	},
	init: function(e) {
		tvfreebox.myDump('init ' + e);
		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('extensions.tvfreebox.');
		if(prefs.prefHasUserValue('tvfreebox_version')) {
			var prefVersion = prefs.getCharPref('tvfreebox_version');
			var firstDotPos = prefVersion.indexOf('.');
			prefVersion = Number(firstDotPos!=-1 ? prefVersion.substring(0, firstDotPos+1) + prefVersion.substring(firstDotPos).replace(/\./g, '') : prefVersion);
			if(prefVersion<2.2) tvfreebox.updatePrefs2Json(prefs);
		} else tvfreebox.manageOldPrefs();
		prefs.setCharPref('tvfreebox_version', tvfreebox.tvfreebox_version);
		tvfreebox.myPrefObserver.register();
		tvfreebox.keys     = JSON.parse(prefs.getComplexValue('keys', Components.interfaces.nsISupportsString).data);
		tvfreebox.configs  = prefs.getComplexValue('configs', Components.interfaces.nsISupportsString).data;
		tvfreebox.label    = prefs.getComplexValue('label', Components.interfaces.nsISupportsString).data;
		tvfreebox.version  = prefs.getCharPref('version');
		tvfreebox.boitier  = prefs.getCharPref('boitier');
		tvfreebox.code     = prefs.getCharPref('code');
		tvfreebox.zoom     = prefs.getCharPref('zoom');
		tvfreebox.help     = prefs.getBoolPref('help');
		tvfreebox.showicon = prefs.getBoolPref('showicon');
		tvfreebox.setZoom(tvfreebox.version, tvfreebox.zoom);
		var popup1 = document.getElementById('tvfreebox-popup1-image-v5');
		var popup2 = document.getElementById('tvfreebox-popup2-image-v5');
		if(tvfreebox.version=='v5') {
			if(popup1) {
				popup1.style.display = '';
				document.getElementById('tvfreebox-popup1-image-v6').style.display = 'none';
			}
			if(popup2) {
				popup2.style.display = '';
				document.getElementById('tvfreebox-popup2-image-v6').style.display = 'none';
			}
		} else {
			if(popup1) {
				popup1.style.display = 'none';
				document.getElementById('tvfreebox-popup1-image-v6').style.display = '';
			}
			if(popup2) {
				popup2.style.display = 'none';
				document.getElementById('tvfreebox-popup2-image-v6').style.display = '';
			}
		}
		var status = document.getElementById('tvfreebox-status');
		if(status) {
			status.style.display = tvfreebox.showicon ? '' : 'none';
			status.src = 'chrome://tvfreebox/skin/' + tvfreebox.version + '/icon.png';
		}
		var button = document.getElementById('tvfreebox-toolbar-button');
		if(button) button.className = tvfreebox.version + ' toolbarbutton-1 chromeclass-toolbar-additional';
		tvfreebox.setTitle(tvfreebox.help);
		if(e) {
			e.originalTarget.onkeydown = tvfreebox.doKeyDown;
			e.originalTarget.onkeyup   = tvfreebox.keyUp;
			e.originalTarget.addEventListener('DOMMouseScroll', tvfreebox.doOnMouseScroll, false);
		}
	}
};
window.addEventListener('load', tvfreebox.init, false);