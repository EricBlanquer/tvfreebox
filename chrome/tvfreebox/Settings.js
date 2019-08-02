var checkOptTimeout;
var zoomTimeout;
var zoomTimeoutDelay = 500;

function checkOptions() {
    resetOptionsMessages();
    var boitier = document.getElementById('boitier').value;
    var code = document.getElementById('code').value;
    var version = getVersion();
    var xhr = new XMLHttpRequest();
    var key = version=='v5' ? 'start' : 'back';
    var url;
    if (boitier == '0') {
        url = document.getElementById('boitier_custom').value;
    }
    else {
        url = 'http://hd' + boitier + '.freebox.fr';
    }
    xhr.open('GET', url + '/pub/remote_control?code=' + code + '&key=' + key + '&a=' + Math.random(), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState==4) {
            clearTimeout(checkOptTimeout);
            if (xhr.status!=0) resetOptionsMessages();
            if (xhr.status==200) {
                document.getElementById('opt_mess_ok').style.display = '';
            } else if (xhr.status==403) {
                document.getElementById('opt_mess_code').style.display = '';
            } else if (xhr.status==404) {
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
    var label = document.getElementById('label').value;
    var version = getVersion();
    var boitier = document.getElementById('boitier').value;
    var boitier_custom = document.getElementById('boitier_custom').value;
    var code= document.getElementById('code').value;
    var zoom= document.getElementById('zoom').value;
    var help= document.getElementById('help').checked;
    var inpopup = document.getElementById('inpopup').checked;
    var alphakeys = document.getElementById('alphakeys').checked;
    configs[configs.length] = { label: label, version: version, boitier: boitier, boitier_custom: boitier_custom, code: code, zoom: zoom, help: help, inpopup: inpopup, alphakeys: alphakeys };
    var cptLabel = 1;
    if (!firstConfig) {
        var found;
        do {
            found = false;
            for(var i=0; i<configs.length; i++) {
                if (configs[i].label=='nouvelle' + (cptLabel!=1 ? ' #' + cptLabel : '')) {
                    cptLabel++;
                    found = true;
                }
            }
        } while(found);
    }
    setConfigsInPrefs(configs);
    document.getElementById('label').value= firstConfig ? 'principale' : 'nouvelle' + (cptLabel!=1 ? ' #' + cptLabel : '');
    document.getElementById('version6').checked = true;
    document.getElementById('boitier').value= '1';
    document.getElementById('boitier_custom').value = 'http://freebox-player.home';
    document.getElementById('code').value = '';
    document.getElementById('zoom').value = '500';
    document.getElementById('help').checked = true;
    document.getElementById('inpopup').checked= false;
    document.getElementById('alphakeys').checked= false;
    populateLabels(document.getElementById('labels'));
}

function removeConfig() {
    var configs = getConfigs();
    if (configs && configs.length) {
        document.getElementById('label').value= configs[configs.length-1].label;
        if (configs[configs.length-1].version=='v5') document.getElementById('version5').checked = 'checked';
        else if (configs[configs.length-1].version=='v6') document.getElementById('version6').checked = 'checked';
        else document.getElementById('version7').checked = 'checked';
        document.getElementById('boitier').value = configs[configs.length-1].boitier;
        document.getElementById('boitier_custom').value= configs[configs.length-1].boitier_custom;
        document.getElementById('code').value= configs[configs.length-1].code;
        document.getElementById('zoom').value= configs[configs.length-1].zoom;
        document.getElementById('help').checked= configs[configs.length-1].help;
        document.getElementById('inpopup').checked = configs[configs.length-1].inpopup;
        document.getElementById('alphakeys').checked = configs[configs.length-1].alphakeys;
        configs[configs.length-1] = null;
    } else newConfig(true);
    setConfigsInPrefs(configs);
    populateLabels(document.getElementById('labels'));
}

function setConfigsInPrefs(configs) {
    var txtConfig = [];
    for(var i=0; i<configs.length; i++) {
        if (configs[i]!=null) {
            txtConfig.push(serializeConfig(configs[i], i+1));
        }
    }
    localStorage['configs'] = '[' + txtConfig.join(',') + ']';
}

function serializeConfig(config, id) {
    var txt = '{';
    txt += '\'configid\':\''+ id;
    txt += '\',\'label\':\''+ config.label;
    txt += '\',\'version\':\''+ config.version;
    txt += '\',\'boitier\':\''+ config.boitier;
    txt += '\',\'boitier_custom\':\'' + config.boitier_custom;
    txt += '\',\'code\':\'' + config.code;
    txt += '\',\'zoom\':\'' + config.zoom;
    txt += '\',\'help\':\'' + config.help;
    txt += '\',\'inpopup\':'+ config.inpopup;
    txt += ',\'alphakeys\':'+ config.alphakeys;
    txt += '}';
    return txt;
}

function populateLabels(select) {
    var configs = getConfigs();
    while(select.childNodes.length) select.removeChild(select.lastChild);
    var option = document.createElement('option');
    var value = document.getElementById('label').value;
    if (value=='' && !configs.length) {
        value = 'principale';
        document.getElementById('label').value = value;
    }
    option.appendChild(document.createTextNode(value));
    option.setAttribute('value', value);
    var config = { label:document.getElementById('label').value
        , version:getVersion()
        , boitier:document.getElementById('boitier').value
        , boitier_custom: document.getElementById('boitier_custom').value
        , code: document.getElementById('code').value
        , zoom: document.getElementById('zoom').value
        , help: document.getElementById('help').checked
        , inpopup:document.getElementById('inpopup').checked
        , alphakeys:document.getElementById('alphakeys').checked
    };
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
    var config;
    try {
        config = JSON.parse('[' + option.getAttribute('data-config') + ']');
    } catch(e) {
        config = eval('[' + option.getAttribute('data-config') + ']');
    }
    if (config[0].configid!='0') {
        var configs = getConfigs(localStorage['configs']);
        var txtConfig = [];
        for(var i=0; i<configs.length; i++) {
            if (configs[i].configid==config[0].configid) {
                configs[i].label= document.getElementById('label').value;
                configs[i].version= getVersion();
                configs[i].boitier= document.getElementById('boitier').value;
                configs[i].boitier_custom = document.getElementById('boitier_custom').value;
                configs[i].code = document.getElementById('code').value;
                configs[i].zoom = document.getElementById('zoom').value;
                configs[i].help = document.getElementById('help').checked;
                configs[i].inpopup= document.getElementById('inpopup').checked;
                configs[i].alphakeys= document.getElementById('alphakeys').checked;
            }
            txtConfig.push(serializeConfig(configs[i], i+1));
        }
        localStorage['configs']= '[' + txtConfig.join(',') + ']';
        document.getElementById('label').value= config[0].label;
        if (config[0].version=='v5') document.getElementById('version5').checked = 'checked';
        else if (config[0].version=='v6') document.getElementById('version6').checked = 'checked';
        else document.getElementById('version7').checked = 'checked';
        document.getElementById('boitier').value = config[0].boitier;
        document.getElementById('boitier_custom').value= config[0].boitier_custom;
        document.getElementById('code').value= config[0].code;
        document.getElementById('zoom').value= config[0].zoom;
        document.getElementById('help').checked= config[0].help;
        document.getElementById('inpopup').checked = config[0].inpopup;
        document.getElementById('alphakeys').checked = config[0].alphakeys;
        populateLabels(document.getElementById('labels'));
        setSettings();
    }
}

function getConfigs(txtConfig) {
    var configs = false;
    try {
        if (txtConfig) {
            try {
                configs = JSON.parse(txtConfig);
            } catch(e) {
                configs = eval(txtConfig);
            }
        } else {
            var conf = localStorage['configs'];
            if (conf) {
                try {
                    configs = JSON.parse(conf);
                } catch(e) {
                    configs = eval(conf);
                }
            } else configs = [];
        }
    } catch(e) {}
    return configs ? configs : []; 
}

function getVersion() {
    return document.getElementById('version5').checked 
        ? 'v5' 
        : document.getElementById('version6').checked
        ? 'v6'
        : 'v7';
}

function setSettings() {
    var version = getVersion();
    localStorage['version'] = version;
    localStorage['code']= document.getElementById('code').value;
    var select = document.getElementById('boitier');
    localStorage['boitier'] = select.children[select.selectedIndex].value;
    localStorage['boitier_custom'] = document.getElementById('boitier_custom').value;
    localStorage['help'] = document.getElementById('help').checked ? '1' : '0';
    localStorage['zoom'] = document.getElementById('zoom').value;
    localStorage['label'] = document.getElementById('label').value;
    localStorage['inpopup'] = document.getElementById('inpopup').checked ? '1' : '0';
    localStorage['alphakeys'] = document.getElementById('alphakeys').checked ? '1' : '0';
    chrome.browserAction.setIcon({'path': version + '.png'});
    populateLabels(document.getElementById('labels'));
    if (localStorage['boitier'] == '0') {
        document.getElementById('boitier_custom_zone').style.display = 'block';
    }
    else {
        document.getElementById('boitier_custom_zone').style.display = 'none';
    }
}

function getSettings() {
    var version = localStorage['version'];
    if (version == 'v5') {
        document.getElementById('version5').checked = 'checked';
    }
    else if (version == 'v6') {
        document.getElementById('version6').checked = 'checked';
    }
    else {
        document.getElementById('version7').checked = 'checked';
    }
    var code = localStorage['code'];
    document.getElementById('code').value = code ? code : '';
    setSelect(document.getElementById('boitier'), localStorage['boitier']);
    document.getElementById('boitier_custom').value = localStorage['boitier_custom'] || 'http://freebox-player.home';
    var zoom = localStorage['zoom'];
    if (isNaN(zoom)) zoom = 600;
    document.getElementById('zoom').value = zoom;
    document.getElementById('help').checked = localStorage['help']!='0';
    var label = localStorage['label'];
    document.getElementById('label').value = label ? label : '';
    document.getElementById('inpopup').checked = localStorage['inpopup']=='1';
    document.getElementById('alphakeys').checked = localStorage['alphakeys']=='1';
    populateLabels(document.getElementById('labels'));
    if (localStorage['boitier'] == '0') {
        document.getElementById('boitier_custom_zone').style.display = 'block';
    }
    else {
        document.getElementById('boitier_custom_zone').style.display = 'none';
    }
}

function setSelect(select, value) {
    for(var i = 0; i < select.children.length; i++) {
        var child = select.children[i];
        if (child.value == value) {
            child.selected = 'true';
            break;
        }
    }
}

function init() {
    getSettings();
    document.getElementById('label').onchange = setSettings;
    document.getElementById('version5').onchange = setSettings;
    document.getElementById('version6').onchange = setSettings;
    document.getElementById('version7').onchange = setSettings;
    document.getElementById('boitier').onchange = setSettings;
    document.getElementById('boitier_custom').onchange = setSettings;
    document.getElementById('code').onchange = setSettings;
    document.getElementById('help').onchange = setSettings;
    document.getElementById('alphakeys').onchange = setSettings;
    document.getElementById('zoom').onchange = function(){if (this.value<200) this.value=200;setSettings();};
    document.getElementById('inpopup').onchange = setSettings;
    document.getElementById('labels').onchange = function(){ changeConfig(this); };
    document.getElementById('img_version7').onclick = function(){document.getElementById('version7').checked='checked';};
    document.getElementById('img_version6').onclick = function(){document.getElementById('version6').checked='checked';};
    document.getElementById('img_version5').onclick = function(){document.getElementById('version5').checked='checked';};
    document.getElementById('btn_tester').onclick = checkOptions;
    document.getElementById('zoom').onclick = function(){ this.select();};
    document.getElementById('btn_newconfig').onclick = function(){newConfig();};
    document.getElementById('btn_removeconfig').onclick = function(){removeConfig();};
    document.getElementById('link_config_key').onclick = function(){displayConfigKeys();return false;};
    document.getElementById('link_reset_key').onclick = function(){resetConfigKeys();return false;};
    document.getElementById('link_config_key_back').onclick = function(){hideConfigKeys();return false;};
}
window.addEventListener('load', init, false);