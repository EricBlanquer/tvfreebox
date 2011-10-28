var tvfreebox_options = {
	//debug: true,
	checkCode: function(input) {
		tvfreebox_options.myDump('checkCode');
		input.boxObject.firstChild.style.backgroundColor = isNaN(input.value) ? 'red' : '';
	},
	checkOptions: function() {
		tvfreebox_options.myDump('checkOptions');
		tvfreebox_options.resetOptionsMessages();
		var boitier = document.getElementById('boitier').value;
		var code = document.getElementById('code').value;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://hd' + boitier + '.freebox.fr/pub/remote_control?code=' + code + '&key=start&a=' + Math.random(), true);
		xhr.onreadystatechange = function() {
			if(xhr.readyState==4 && typeof(tvfreebox_options)!=typeof(void(0))) {
				if(tvfreebox_options.checkOptTimeout) clearTimeout(tvfreebox_options.checkOptTimeout);
				tvfreebox_options.resetOptionsMessages();
				if(xhr.status==200) {
					document.getElementById('opt_mess_ok').style.display = '';
				} else if(xhr.status==403) {
					document.getElementById('opt_mess_code').style.display = '';
				} else if(xhr.status==404) {
					document.getElementById('opt_mess_version').style.display = '';
				}
			}
		};
		tvfreebox_options.checkOptTimeout = setTimeout(tvfreebox_options.checkOptionsFailed, 3000);
		xhr.send();
	},
	checkOptionsFailed: function() {
		tvfreebox_options.myDump('checkOptionsFailed');
		document.getElementById('opt_mess_timeout').style.display = '';
	},
	resetOptionsMessages: function() {
		tvfreebox_options.myDump('resetOptionsMessages');
		document.getElementById('opt_mess_ok').style.display = 'none';
		document.getElementById('opt_mess_code').style.display = 'none';
		document.getElementById('opt_mess_version').style.display = 'none';
		document.getElementById('opt_mess_timeout').style.display = 'none';
	},
	newConfig: function(firstConfig) {
		tvfreebox_options.myDump('newConfig');
		var configs = tvfreebox_options.getConfigs();
		var label    = document.getElementById('label').value;
		var version  = document.getElementById('version').value;
		var boitier  = document.getElementById('boitier').value;
		var code     = document.getElementById('code').value;
		var zoom     = document.getElementById('zoom').value;
		var help     = document.getElementById('help').value;
		var showicon = document.getElementById('showicon').value;
		configs[configs.length] = { label: label, version: version, boitier: boitier, code: code, zoom: zoom, help: help, showicon: showicon };
		var cptLabel = 1;
		if(!firstConfig) {
			var found;
			do {
				found = false;
				for(var i=0; i<configs.length; i++) {
					if(configs[i].label=='nouvelle' + (cptLabel!=1 ? ' #' + cptLabel : '')) {
						cptLabel++;
						found = true;
					}
				}
			} while(found);
		}
		tvfreebox_options.setConfigsInPrefs(configs);
		document.getElementById('label').value    = firstConfig ? 'principale' : 'nouvelle' + (cptLabel!=1 ? ' #' + cptLabel : '');
		document.getElementById('version').value  = 'v6';
		document.getElementById('boitier').value  = '1';
		document.getElementById('code').value     = '';
		document.getElementById('zoom').value     = '500';
		document.getElementById('help').value     = true;
		document.getElementById('showicon').value = true;
		tvfreebox_options.populateLabels(document.getElementById('labels'));
	},
	removeConfig: function() {
		tvfreebox_options.myDump('removeConfig');
		var configs = tvfreebox_options.getConfigs();
		if(configs && configs.length) {
			document.getElementById('label').value    = configs[configs.length-1].label;
			document.getElementById('version').value  = configs[configs.length-1].version;
			document.getElementById('boitier').value  = configs[configs.length-1].boitier;
			document.getElementById('code').value     = configs[configs.length-1].code;
			document.getElementById('zoom').value     = configs[configs.length-1].zoom;
			document.getElementById('help').value     = configs[configs.length-1].help;
			document.getElementById('showicon').value = configs[configs.length-1].showicon;
			configs[configs.length-1] = null;
		} else tvfreebox_options.newConfig(true);
		tvfreebox_options.setConfigsInPrefs(configs);
		tvfreebox_options.populateLabels(document.getElementById('labels'));
	},
	setConfigsInPrefs: function(configs) {
		tvfreebox_options.myDump('setConfigsInPrefs');
		document.getElementById('configs').value = JSON.stringify(configs);
	},
	populateLabels: function(menulist) {
		tvfreebox_options.myDump('populateLabels');
		var configs = tvfreebox_options.getConfigs();
		while(menulist.childNodes.length) menulist.removeChild(menulist.lastChild);
		var menupopup = document.createElement('menupopup');
		menulist.appendChild(menupopup);
		var menuitem = document.createElement('menuitem');
		var value = document.getElementById('label').value;
		menuitem.setAttribute('label', value);
		menuitem.setAttribute('value', value);
		menuitem.setAttribute('oncommand', 'tvfreebox_options.changeConfig(this);');
		var config = { configid: 0
					 , label:    document.getElementById('label').value
					 , version:  document.getElementById('version').value
					 , boitier:  document.getElementById('boitier').value
					 , code:     document.getElementById('code').value
					 , zoom:     document.getElementById('zoom').value
					 , help:     document.getElementById('help').value
					 , showicon: document.getElementById('showicon').value };
		menuitem.setUserData('data-config', JSON.stringify(config), null);
		menupopup.appendChild(menuitem);
		var configs = tvfreebox_options.getConfigs(document.getElementById('configs').value);
		for(var i=0; i<configs.length; i++) {
			var menuitem = document.createElement('menuitem');
			var value = configs[i].label;
			menuitem.setAttribute('label', value);
			menuitem.setAttribute('value', value);
			menuitem.setAttribute('oncommand', 'tvfreebox_options.changeConfig(this);');
			configs[i].configid = i+1;
			menuitem.setUserData('data-config', JSON.stringify(configs[i]), null);
			menupopup.appendChild(menuitem);
		}
	},
	changeConfig: function(menuitem) {
		tvfreebox_options.myDump('changeConfig');
		var config = JSON.parse(menuitem.getUserData('data-config'));
		if(config[0].configid!='0') {
			var configs = tvfreebox_options.getConfigs(document.getElementById('configs').value);
			var txtConfig = [];
			for(var i=0; i<configs.length; i++) {
				if(configs[i].configid==config[0].configid) {
					configs[i].label    = document.getElementById('label').value;
					configs[i].version  = document.getElementById('version').value;
					configs[i].boitier  = document.getElementById('boitier').value;
					configs[i].code     = document.getElementById('code').value;
					configs[i].zoom     = document.getElementById('zoom').value;
					configs[i].help     = document.getElementById('help').value;
					configs[i].showicon = document.getElementById('showicon').value;
				}
				configs[i].configid = i+1;
				txtConfig.push(JSON.stringify(configs[i]));
			}
			document.getElementById('configs').value  = '[' + txtConfig.join(',') + ']';
			document.getElementById('label').value    = config[0].label;
			document.getElementById('version').value  = config[0].version;
			document.getElementById('boitier').value  = config[0].boitier;
			document.getElementById('code').value     = config[0].code;
			document.getElementById('zoom').value     = config[0].zoom;
			document.getElementById('help').value     = config[0].help;
			document.getElementById('showicon').value = config[0].showicon;
			tvfreebox_options.populateLabels(document.getElementById('labels'));
		}
	},
	getConfigs: function(txtConfig) {
		tvfreebox_options.myDump('getConfigs');
		var configs = false;
		try {
			configs = JSON.parse(txtConfig ? txtConfig : document.getElementById('configs').value);
		} catch(e) {}
		return configs ? configs : []; 
	},
	myDump: function(aMessage) {
		if(tvfreebox_options.debug) {
			var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
			consoleService.logStringMessage("tvfreebox_options : " + aMessage);
		}
	},
	init: function() {
		tvfreebox_options.myDump('init');
		var menulist = document.getElementById('labels');
		if(menulist) tvfreebox_options.populateLabels(menulist);
	}
};
window.addEventListener('load', tvfreebox_options.init, false);