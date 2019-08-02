var debug = false;
var keys;
var defaultkeys = {normal:{8:'back',13:'ok',20:'swap',27:'power',32:'0',33:'prgm_inc',34:'prgm_dec',35:'blue',36:'green',37:'left',38:'up',39:'right',40:'down',45:'red',46:'yellow',48:'2,5',49:'7,6',50:'3,5',51:'1,7',52:'1,6',54:'1,5',55:'3,6',65:'2',66:'2,2',67:'2,3',68:'3',69:'3,2',70:'3,3',71:'4',72:'4,2',73:'4,3',74:'5',75:'5,2',76:'5,3',77:'6',78:'6,2',79:'6,3',80:'7',81:'7,2',82:'7,3',83:'7,4',84:'8',85:'8,2',86:'8,3',87:'9',88:'9,2',89:'9,3',90:'9,4',93:'list',96:'0',97:'1',98:'2',99:'3',100:'4',101:'5',102:'6',103:'7',104:'8',105:'9',106:'prgm_inc',107:'vol_inc',109:'vol_dec',110:'1',111:'prgm_dec',188:'1,2',192:'8,5',222:'tv',223:'1,4'},shift:{27:'mute',48:'0,2',49:'1,8',50:'2,4',51:'3,4',52:'4,4',53:'5,4',54:'6,4',55:'7,5',56:'8,4',57:'9,5',87:'play',88:'stop',65:'bwd',66:'bwd',70:'fwd',77:'mute',78:'next',80:'prev',81:'prev',83:'next',82:'rec',90:'fwd',96:'0,2',97:'1,8',98:'2,4',99:'3,4',100:'4,4',101:'5,4',102:'6,4',103:'7,5',104:'8,4',105:'9,5',188:'info',190:'mail',191:'help',192:'play',220:'stop',223:'pip'},ctrl:{17:'home'}};
var labels = { 8: 'Retour', 9: 'Tabulation', 13: 'Entrée', 16: 'Shift', 17: 'Ctrl', 18: 'Alt', 19: 'Pause', 20: 'Caps lock', 27: 'Echape', 32: 'Espace', 33: 'Page haut', 34: 'Page bas', 35: 'Fin', 36: 'Début', 37: 'Fléche gauche', 38: 'Fléche haut', 39: 'Fléche droite', 40: 'Fléche bas', 45: 'Insertion', 46: 'Suppression', 59: '$', 91: 'Commande gauche', 92: 'Commande droite', 93: 'Menu contextuel', 96: 'Pavé num. 0', 97: 'Pavé num. 1', 98: 'Pavé num. 2', 99: 'Pavé num. 3', 100: 'Pavé num. 4', 101: 'Pavé num. 5', 102: 'Pavé num. 6', 103: 'Pavé num. 7', 104: 'Pavé num. 8', 105: 'Pavé num. 9', 106: 'Pavé num. *', 107: 'Pavé num. +', 109: 'Pavé num. -', 111: 'Pavé num. /', 112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6', 118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12', 145: 'Arrêt Défil', 172: 'Accueil', 173: 'Couper son', 174: 'Volume -', 175: 'Volume +', 177: 'Précédent', 179: 'Lecture', 180: 'Messagerie', 181: 'Media', 188: ',', 190: ';', 191: ':', 192: 'ù', 219: ')', 220: '*', 221: '^', 222: '²', 223: '!', 226: '<' };
var labelsFR = { power: 'Alimentation', tv: 'AV/TV', list: 'Liste', red: 'Rouge', yellow: 'Jaune', green: 'Vert', blue: 'Bleu', back: 'Retour', swap: 'Swap', info: 'Info', mail: 'Message', help: 'Aide', pip: 'PIP', vol_inc: 'Volume Plus', vol_dec: 'Volume Moins', up: 'Haut', down: 'Bas', left: 'Gauche', right: 'Droite', ok: 'OK', prgm_inc: 'Programme Plus', prgm_dec: 'Programme Moins', mute: 'Couper le son', bwd: 'Ralentir', prev: 'Précédent', rec: 'Enregistrement', fwd: 'Accélérer', next: 'Suivant', play: 'Lecture', stop: 'Stop', home: 'Free', padUp: 'pad Haut', padDown: 'pad Bas', padLeft: 'pad Gauche', padRight: 'pad Droite' };
function doOnMouseDown(element){
    pressKey(element.getAttribute('key'));
}
function pressKey(key) {
    myDump('pressKey ' + key);
    var cdes = [];
    useShiftOnly = void(0);
    useCtrlOnly = void(0);
    useAltOnly = void(0);
    if (key) {
        for(var type in keys) {
            for(var code in keys[type]) {
                var typecode = type + ',' + code;
                if (keys[type][code].split(',')[0]==key) {
                    cdes.push(typecode);
                }
                if (code==16) useShiftOnly = typecode;
                else if (code==17) useCtrlOnly = typecode;
                else if (code==18) useAltOnly = typecode;
            }
        }
        var label = document.getElementById('keys_config_label');
        var labelFR = labelsFR[key];
        var keyLabel = labelFR ? labelFR : key;
        label.innerHTML = 'Configuration de la touche ' + keyLabel;
    } else document.getElementById('keys_config_label').innerHTML = '';
    document.getElementById('label_output').style.display = 'none';
    var label_shift = document.getElementById('label_shift');
    var label_ctrl = document.getElementById('label_ctrl');
    var label_alt = document.getElementById('label_alt');
    if (useShiftOnly) {
        label_shift.style.display =  '';
        if (label!=keyLabel) label_shift.innerHTML = 'Shift est déjà attribuée pour la touche ' + getLabel(useShiftOnly);
        else label_shift.style.display = 'none';
    } else label_shift.style.display = 'none';
    if (useCtrlOnly) {
        label_ctrl.style.display =  '';
        if (label!=keyLabel) label_ctrl.innerHTML = 'Ctrl est déjà attribuée pour la touche ' + getLabel(useCtrlOnly);
        else label_ctrl.style.display = 'none';
    } else label_ctrl.style.display = 'none';
    if (useAltOnly) {
        label_alt.style.display =  '';
        if (label!=keyLabel) label_alt.innerHTML = 'Alt est déjà attribuée pour la touche ' + getLabel(useAltOnly);
        else label_alt.style.display = 'none';
    } else label_alt.style.display =  'none';
    var zone = document.getElementById('keys_config');
    zone.style.display = key ? '' : 'none';
    zone = zone.getElementsByTagName('tbody')[0];
    while(zone.childNodes.length) { zone.removeChild(zone.lastChild); }
    if (key) {
        var addrow = document.createElement('tr');
        var addcheckbox1 = document.createElement('input');
        addcheckbox1.setAttribute('type', 'checkbox');
        addcheckbox1.setAttribute('id', 'useShift');
        if (useShiftOnly) addcheckbox1.setAttribute('disabled', 'true');
        addcheckbox1.onclick = function(e) { setTouche(e, this); };
        var addtd = document.createElement('td');
        addtd.appendChild(addcheckbox1);
        addrow.appendChild(addtd);
        var addcheckbox2 = document.createElement('input');
        addcheckbox2.setAttribute('type', 'checkbox');
        addcheckbox2.setAttribute('id', 'useCtrl');
        if (useCtrlOnly) addcheckbox2.setAttribute('disabled', 'true');
        addcheckbox2.onclick = function(e) { setTouche(e, this); };
        addtd = document.createElement('td');
        addtd.appendChild(addcheckbox2);
        addrow.appendChild(addtd);
        var addcheckbox3 = document.createElement('input');
        addcheckbox3.setAttribute('type', 'checkbox');
        addcheckbox3.setAttribute('id', 'useAlt');
        if (useAltOnly) addcheckbox3.setAttribute('disabled', 'true');
        addcheckbox3.onclick = function(e) { setTouche(e, this); };
        addtd = document.createElement('td');
        addtd.appendChild(addcheckbox3);
        addrow.appendChild(addtd);
        var addtextbox1 = document.createElement('input');
        addtextbox1.setAttribute('type', 'text');
        addtextbox1.style.width = '100%';
        addtextbox1.onkeyup = function(e) { setTouche(e, this); };
        addtextbox1.onchange = function(e) { setTouche(e, this); };
        addtextbox1.setAttribute('id', 'touche');
        addtextbox1.setAttribute('name', 'touche');
        addtextbox1.setAttribute('size', '1');
        addtextbox1.setAttribute('maxlength', '1');
        addtextbox1.setAttribute('readonly', 'true');
        addtextbox1.setAttribute('key', key);
        addtd = document.createElement('td');
        addtd.appendChild(addtextbox1);
        addrow.appendChild(addtd);
        var addtextbox2 = document.createElement('input');
        addtextbox2.setAttribute('id', 'repeat');
        addtextbox2.setAttribute('type', 'number');
        addtextbox2.setAttribute('min', '1');
        addtextbox2.setAttribute('max', '32');
        addtextbox2.setAttribute('decimalplaces', '0');
        addtextbox2.setAttribute('size', '1');
        addtextbox2.setAttribute('maxlength', '1');
        addtextbox2.setAttribute('value', 1);
        addtd = document.createElement('td');
        addtd.appendChild(addtextbox2);
        addrow.appendChild(addtd);
        var addbox = document.createElement('div');
        var addimage = document.createElement('image');
        addimage.setAttribute('src', 'add.png');
        addimage.style.marginTop = '5px';
        addimage.style.cursor = 'pointer';
        addimage.onclick = function() { addTouche(this); };
        addbox.appendChild(addimage);
        addtd = document.createElement('td');
        addtd.appendChild(addbox);
        addrow.appendChild(addtd);
        zone.appendChild(addrow);
        addrow = document.createElement('tr');
        addtd = document.createElement('td');
        addtd.setAttribute('colspan', 6);
        addtd.style.borderBottom = '1px dotted #666666';
        addtd.style.marginBottom = '10px';
        addtd.style.paddingBottom = '10px';
        addrow.appendChild(addtd);
        zone.appendChild(addrow);
        for(var i=0; i<cdes.length; i++) {
            var keyDatas = cdes[i].split(',');
            var touche = labels[keyDatas[1]];
            if (!touche) touche = String.fromCharCode(keyDatas[1]);
            var datas = keys[keyDatas[0]][keyDatas[1]].split(',');
            var row = document.createElement('tr');
            row.setAttribute('data', cdes[i]);
            var checkbox1 = document.createElement('input');
            checkbox1.setAttribute('type', 'checkbox');
            if (keyDatas[0]=='shift' && touche!='Shift') checkbox1.setAttribute('checked', 'true');
            checkbox1.setAttribute('disabled', 'true');
            var td = document.createElement('td');
            td.appendChild(checkbox1);
            row.appendChild(td);        
            var checkbox2 = document.createElement('input');
            checkbox2.setAttribute('type', 'checkbox');
            if (keyDatas[0]=='ctrl' && touche!='Ctrl') checkbox2.setAttribute('checked', 'true');
            checkbox2.setAttribute('disabled', 'true');
            td = document.createElement('td');
            td.appendChild(checkbox2);
            row.appendChild(td);
            var checkbox3 = document.createElement('input');
            checkbox3.setAttribute('type', 'checkbox');
            if (keyDatas[0]=='alt' && touche!='Alt') checkbox3.setAttribute('checked', 'true');
            checkbox3.setAttribute('disabled', 'true');
            td = document.createElement('td');
            td.appendChild(checkbox3);
            row.appendChild(td);
            var textbox1 = document.createElement('input');
            textbox1.style.width = '100%';
            textbox1.setAttribute('type', 'text');
            textbox1.setAttribute('name', 'touche');
            textbox1.setAttribute('size', '1');
            textbox1.setAttribute('maxlength', '1');
            textbox1.setAttribute('readonly', 'true');
            textbox1.setAttribute('value', touche);
            textbox1.setAttribute('title', touche);
            td = document.createElement('td');
            td.appendChild(textbox1);
            row.appendChild(td);
            var textbox2 = document.createElement('input');
            textbox2.setAttribute('type', 'number');
            textbox2.setAttribute('min', '1');
            textbox2.setAttribute('max', '32');
            textbox2.setAttribute('decimalplaces', '0');
            textbox2.setAttribute('size', '1');
            textbox2.setAttribute('maxlength', '1');
            textbox2.setAttribute('readonly', 'true');
            textbox2.setAttribute('value', datas.length>1 ? datas[1] : 1);
            td = document.createElement('td');
            td.appendChild(textbox2);
            row.appendChild(td);
            var box = document.createElement('div');
            var image = document.createElement('image');
            image.setAttribute('src', 'delete.png');
            image.style.marginTop = '5px';
            image.style.cursor = 'pointer';
            image.onclick = function(e) { deleteTouche(e, this); };
            box.appendChild(image);
            td = document.createElement('td');
            td.appendChild(box);
            row.appendChild(td);
            zone.appendChild(row);
        }
    }
}

function getLabel(datas) {
    myDump('getLabel');
    var keyDatas = datas.split(',');
    var label = keys[keyDatas[0]][keyDatas[1]].split(',')[0];
    var labelFR = labelsFR[label];
    if (labelFR) label = labelFR;
    return label;
}

function addTouche(img) {
    myDump('addTouche');
    var touche  = document.getElementById('touche');
    var keycode = touche.getAttribute('keycode');
    if (keycode) {
        var useShift = document.getElementById('useShift').checked || keycode==16;
        var useCtrl  = document.getElementById('useCtrl').checked || keycode==17;
        var useAlt   = document.getElementById('useAlt').checked || keycode==18;
        var repeat   = Number(document.getElementById('repeat').value);
        var type = '';
        if (useShift) type += 'shift';
        if (useCtrl)  type += 'ctrl';
        if (useAlt)   type += 'alt';
        if (type=='') type = 'normal';
        var key = touche.getAttribute('key');
        if (!keys[type]) keys[type] = {};
        keys[type][keycode] = key + (repeat!=1 ? ',' + repeat : '');
        setKeysInPrefs();
        pressKey(key);
    }
}

function isEmpty(object) {
    myDump('isEmpty');
    var result = true;
    if (typeof(object)==typeof({})) {
        for(var obj in object) {
            result = false;
        }
    }
    return result;
}

function deleteTouche(event, element) {
    myDump('deleteTouche');
    while(element.nodeName.toLowerCase()!='tr') { element = element.parentNode; }
    var keyDatas = element.getAttribute('data').split(',');
    var key = keys[keyDatas[0]][keyDatas[1]];
    delete(keys[keyDatas[0]][keyDatas[1]]);
    if (isEmpty(keys[keyDatas[0]])) {
        delete(keys[keyDatas[0]]);
    }
    element.parentNode.removeChild(element);
    setKeysInPrefs();
    pressKey(key.split(',')[0]);
}

function setTouche(event, element) {
    myDump('setTouche');
    var touche, code;
    var myElement = element;
    if (myElement.getAttribute('name')=='touche') {
        code = event.keyCode;
        while(myElement.nodeName.toLowerCase()!='tr') { myElement = myElement.parentNode; }
        var checkboxs = myElement.getElementsByTagName('input');
        var type = '';
        if (checkboxs[0].checked) type += 'shift';
        if (checkboxs[1].checked) type += 'ctrl';
        if (checkboxs[2].checked) type += 'alt';
        if (type=='') type = 'normal';
        myDump(code + ', ' + type);
        if (!keys[type]) keys[type] = {};
        var data = myElement.getAttribute('data');
        if (data && !code) code = data.split(',')[1];
        if (code) touche = keys[type][code];
        var label_output = document.getElementById('label_output');
        if (touche) {
            var label = touche.split(',')[0];
            var labelFR = labelsFR[touche];
            if (labelFR) label = labelFR;
            label_output.style.display = '';
            label_output.innerHTML = 'Déjà attribuée pour la touche ' + label;
            element.value = '';
        } else if ((useShiftOnly || keys['shift'] && !isEmpty(keys['shift'])) && code==16 ||
                  (useCtrlOnly || keys['ctrl'] && !isEmpty(keys['ctrl'])) && code==17 ||
                  (useAltOnly || keys['alt'] && !isEmpty(keys['alt'])) && code==18) {
            element.value = '';
        } else {
            var label = labels[code];
            element.value = label ? label : String.fromCharCode(code);
            element.setAttribute('keycode', code);
            label_output.style.display = 'none';
        }
    } else {
        var input = document.getElementById('touche');
        input.value = '';
        input.removeAttribute('keycode');
    }
}

function setKeysInPrefs() {
    myDump('setKeysInPrefs');
    var txtKeys = [];
    for(var type in keys) {
        var txtType = [];
        for(var code in keys[type]) {
            txtType.push('"' + code + '":"' + keys[type][code] + '"');
        }
        txtKeys.push('"' + type + '":{' + txtType.join(',') + '}');
    }
    document.getElementById('resetConfigKeyLink').style.visibility = 'visible';
    localStorage['keys'] = '[{' + txtKeys.join(',') + '}]';
}

function setZoom(version, height) {
    myDump('setZoom');
    if (isNaN(height)) height = 600;
    var zoom = height / (version == 'v5' ? 2132 : version == 'v6' ? 2580 : 3433);
    for(var i=1; i<=2; i++) {
        var img = document.getElementById('tvfreebox-popup' + i + '-image-' + version);
        if (img) {
            if (height!=img.height) {
                img.height = height;
                img.width = Math.round((version == 'v5' ? 565 : version == 'v6' ? 654 : 823)*zoom);
            }
        }
    }
    var lst = document.getElementById(version + '-remoteURLmap').getElementsByTagName('area');
    for(var i=0; i<lst.length; i++) {
        var coords = lst[i].getAttribute('originaleCoords');
        if (!coords) {
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
}

function setTitle(enable) {
    myDump('setTitle');
    var areas = document.getElementsByTagName('area');
    for(var i=0; i<areas.length; i++) {
        var self = areas[i];
        self.style.cursor = 'pointer';
        if (enable) self.setAttribute('title', self.getAttribute('title_bak'));
        else self.setAttribute('title', '');
        self.onmousedown = function(){ doOnMouseDown(this); };
    }
}

function displayNode(node) {
    myDump('displayNode');
    myDump(displayNode_(node));
}

function myDump(aMessage) {
    if (debug) {
        console.log("tvfreebox_configkeys : " + aMessage);
    }
}

function displayNode_(node, indent) {
    myDump('displayNode_');
    if (!indent) indent = 0;
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
        if (!node.childNodes.length) txt += '/>\n';
        else txt += '>\n' + displayNode_(node.firstChild, indent) + spacer + '</' + nodeName + '>\n';
        node = node.nextSibling;
    } while(node && indent!=3);
    return txt;
}

function resetConfigKeys() {
    myDump('resetConfigKeys');
    document.getElementById('resetConfigKeyLink').style.visibility = 'hidden';
    localStorage['keys'] = '';
    keys = defaultkeys;
    pressKey();
}

function hideConfigKeys() {
    document.getElementById('tvfreebox-prefs-pane1').style.display = '';
    document.getElementById('tvfreebox-prefs-pane2').style.display = 'none';
}

function displayConfigKeys() {
    var userkeys = localStorage['keys'];
    if (userkeys) {
        try {
            keys = JSON.parse(userkeys)[0];
        } catch(e) {
            keys = eval(userkeys)[0];
        }
        document.getElementById('resetConfigKeyLink').style.visibility = 'visible';
    } else keys = defaultkeys;
    document.getElementById('tvfreebox-prefs-pane1').style.display = 'none';
    document.getElementById('tvfreebox-prefs-pane2').style.display = '';
    setZoom('v5', 600);
    setZoom('v6', 600);
    setZoom('v7', 600);
    setTitle(true);
}