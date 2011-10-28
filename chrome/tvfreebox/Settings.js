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

function newConfig(firstConfig) {
	var configs = getConfigs();
	var label   = document.getElementById('label').value;
	var version = document.getElementById('version5').checked ? 'v5' : 'v6';
	var boitier = document.getElementById('boitier').value;
	var code    = document.getElementById('code').value;
	var zoom    = document.getElementById('zoom').value;
	var help    = document.getElementById('help').checked;
	var inpopup = document.getElementById('inpopup').checked;
	configs[configs.length] = { label: label, version: version, boitier: boitier, code: code, zoom: zoom, help: help, inpopup: inpopup };
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
	setConfigsInPrefs(configs);
	document.getElementById('label').value    = firstConfig ? 'principale' : 'nouvelle' + (cptLabel!=1 ? ' #' + cptLabel : '');
	document.getElementById('version6').checked  = true;
	document.getElementById('boitier').value     = '1';
	document.getElementById('code').value        = '';
	document.getElementById('zoom').value        = '500';
	document.getElementById('help').checked      = true;
	document.getElementById('inpopup').checked   = false;
	populateLabels(document.getElementById('labels'));
}

function removeConfig() {
	var configs = getConfigs();
	if(configs && configs.length) {
		document.getElementById('label').value    = configs[configs.length-1].label;
		if(configs[configs.length-1].version=='v5') document.getElementById('version5').checked = 'checked';
		else document.getElementById('version6').checked = 'checked';
		document.getElementById('boitier').value   = configs[configs.length-1].boitier;
		document.getElementById('code').value      = configs[configs.length-1].code;
		document.getElementById('zoom').value      = configs[configs.length-1].zoom;
		document.getElementById('help').checked    = configs[configs.length-1].help;
		document.getElementById('inpopup').checked = configs[configs.length-1].inpopup;
		configs[configs.length-1] = null;
	} else newConfig(true);
	setConfigsInPrefs(configs);
	populateLabels(document.getElementById('labels'));
}

function setConfigsInPrefs(configs) {
	var txtConfig = [];
	for(var i=0; i<configs.length; i++) {
		if(configs[i]!=null) {
			txtConfig.push(serializeConfig(configs[i], i+1));
		}
	}
	localStorage['configs'] = '[' + txtConfig.join(',') + ']';
}

function serializeConfig(config, id) {
	var txt = '{';
	txt += 'configid:\''   + id;
	txt += '\',label:\''   + config.label;
	txt += '\',version:\'' + config.version;
	txt += '\',boitier:\'' + config.boitier;
	txt += '\',code:\''    + config.code;
	txt += '\',zoom:\''    + config.zoom;
	txt += '\',help:'      + config.help;
	txt += '\',inpopup:'   + config.inpopup;
	txt += '}';
	return txt;
}

function populateLabels(select) {
	var configs = getConfigs();
	while(select.childNodes.length) select.removeChild(select.lastChild);
	var option = document.createElement('option');
	var value = document.getElementById('label').value;
	if(value=='' && !configs.length) {
		value = 'principale';
		document.getElementById('label').value = value;
	}
	option.appendChild(document.createTextNode(value));
	option.setAttribute('value', value);
	var config = { label:    document.getElementById('label').value
				 , version:  document.getElementById('version5').checked ? 'v5' : 'v6'
				 , boitier:  document.getElementById('boitier').value
				 , code:     document.getElementById('code').value
				 , zoom:     document.getElementById('zoom').value
				 , help:     document.getElementById('help').checked
				 , inpopup:  document.getElementById('inpopup').checked };
	option.setAttribute('data-config', serializeConfig(config, 0));
	select.appendChild(option);
	for(var i=0; i<configs.length; i++) {
		var option = document.createElement('option');
		var value = configs[i].label;
		option.appendChild(document.createTextNode(value));
		option.setAttribute('value', value);
		option.setAttribute('data-config', serializeConfig(configs[i], i+1));
		select.appendChild(option);
	}
}

function changeConfig(select) {
	var option = select.children[select.selectedIndex];
	var config = eval('[' + option.getAttribute('data-config') + ']');
	if(config[0].configid!='0') {
		var configs = getConfigs(localStorage['configs']);
		var txtConfig = [];
		for(var i=0; i<configs.length; i++) {
			if(configs[i].configid==config[0].configid) {
				configs[i].label    = document.getElementById('label').value;
				configs[i].version  = document.getElementById('version5').checked ? 'v5' : 'v6';
				configs[i].boitier  = document.getElementById('boitier').value;
				configs[i].code     = document.getElementById('code').value;
				configs[i].zoom     = document.getElementById('zoom').value;
				configs[i].help     = document.getElementById('help').checked;
				configs[i].inpopup  = document.getElementById('inpopup').checked;
			}
			txtConfig.push(serializeConfig(configs[i], i+1));
		}
		localStorage['configs']  = '[' + txtConfig.join(',') + ']';
		document.getElementById('label').value    = config[0].label;
		if(config[0].version=='v5') document.getElementById('version5').checked = 'checked';
		else document.getElementById('version6').checked = 'checked';
		document.getElementById('boitier').value   = config[0].boitier;
		document.getElementById('code').value      = config[0].code;
		document.getElementById('zoom').value      = config[0].zoom;
		document.getElementById('help').checked    = config[0].help;
		document.getElementById('inpopup').checked = config[0].inpopup;
		populateLabels(document.getElementById('labels'));
		setSettings();
	}
}

function getConfigs(txtConfig) {
	var configs = false;
	try {
		if(txtConfig) configs = eval(txtConfig);
		else {
			var conf = localStorage['configs'];
			configs = conf ? eval(conf) : [];
		}
	} catch(e) {}
	return configs ? configs : []; 
}

function setSettings() {
	var version = document.getElementById('version5').checked ? 'v5' : 'v6';
	localStorage['version'] = version;
	localStorage['code']    = document.getElementById('code').value;
	var select = document.getElementById('boitier');
	localStorage['boitier'] = select.children[select.selectedIndex].value;
	localStorage['help']    = document.getElementById('help').checked ? '1' : '0';
	localStorage['zoom']    = document.getElementById('zoom').value;
	localStorage['label']   = document.getElementById('label').value;
	localStorage['inpopup'] = document.getElementById('inpopup').checked ? '1' : '0';
	chrome.browserAction.setIcon({'path': version + '.png'});
	populateLabels(document.getElementById('labels'));
}

function getSettings() {
	var version = localStorage['version'];
	if(!version) version = 'v6';
	if(version=='v5') document.getElementById('version5').checked = 'checked';
	else document.getElementById('version6').checked = 'checked';
	var code = localStorage['code'];
	document.getElementById('code').value = code ? code : '';
	setSelect(document.getElementById('boitier'), localStorage['boitier']);
	var zoom = localStorage['zoom'];
	if(isNaN(zoom)) zoom = 600;
	document.getElementById('zoom').value = zoom;
	document.getElementById('help').checked = localStorage['help']!='0';
	var label = localStorage['label'];
	document.getElementById('label').value = label ? label : '';
	document.getElementById('inpopup').checked = localStorage['inpopup']=='1';
	populateLabels(document.getElementById('labels'));
}

function setSelect(select, value) {
	for(var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if(child.value == value) {
			child.selected = 'true';
			break;
		}
	}
}