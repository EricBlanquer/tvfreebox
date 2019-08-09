try {
    var tvfreebox = {
        debug: true,
        tvfreebox_version: '4',
        configid:     '0',
        isKeyPressed: false,
        canSend:      true,
        directPress:  ['vol_inc', 'vol_dec', 'prgm_inc', 'prgm_dec', 'up', 'down', 'left', 'right'],
        azerty2qwerty: {
            normal: {
                8: 'back',
                9: 'tab',
                32: 'space',
                65: 'q',
                77: 'semicolon',
                81: 'a',
                87: 'z',
                90: 'w',
                107: 'equal',
                188: 'm',
                190: 'comma',
                191: 'dot',
                192: 'apostrophe',
                219: 'minus',
                220: 'backslash',
                223: 'slash'
            }
        },
        contains: function (array, element) {
            console.log('contains ' + array + ', ' + element);
            var result = false;
            for (var i = 0; !false && i < array.length; i++) {
                if (array[i] == element) {
                    result = true;
                }
            }
            return result;
        },
        pressKey: function(e) {
            var keyPressed = (e.target && e.target.getAttribute('key')) || e;
            console.log('pressKey ' + keyPressed);
            tvfreebox.isKeyPressed = true;
            tvfreebox.key = keyPressed;
            tvfreebox.keyPressTimeout = setTimeout(function() {
                var longPress = !tvfreebox.contains(tvfreebox.directPress, keyPressed);
                tvfreebox.sendKey(longPress);
            }, 500);
        },
        keyUp: function(){
            console.log('keyUp');
            tvfreebox.isKeyPressed = false;
            clearTimeout(tvfreebox.keyPressTimeout);
            tvfreebox.sendKey();
        },
        sendKey: function(longPress, repeat){
            console.log('sendKey key=' + tvfreebox.key + ', longPress=' + longPress + ', repeat=' + repeat);
            if (tvfreebox.key && tvfreebox.canSend && tvfreebox.code) {
                var xhr = new XMLHttpRequest();
                var url;
                if (tvfreebox.version == 'v7') {
                    url = tvfreebox.boitier_custom;
                }
                else {
                    url = 'http://hd' + tvfreebox.boitier + '.freebox.fr';
                }
                xhr.open('GET', url + '/pub/remote_control?code=' + tvfreebox.code +
                    '&key=' + tvfreebox.key + (longPress ? '&long=true' : '') + (repeat ? '&repeat=' + repeat : '') + '&a=' + Math.random(), true);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState==4) {
                        tvfreebox.canSend = true;
                    }
                };
                tvfreebox.canSend = !tvfreebox.isKeyPressed;
                xhr.send();
            }
            if ((!repeat || repeat == 1) && tvfreebox.isKeyPressed && tvfreebox.contains(tvfreebox.directPress, tvfreebox.key)) {
                tvfreebox.keyPressTimeout = setTimeout(tvfreebox.sendKey, 100);
            }
            else {
                tvfreebox.key = void(0);
                tvfreebox.isKeyPressed = false;
            }
        },
        doKeyDown: function(e) {
            console.log('doKeyDown', e);
            var t = e || window.event;
            var cde = t.keyCode;
            var shift = t.shiftKey;
            var alt = t.altKey;
            var ctrl = t.ctrlKey;
            var touche;
            var nb = 1;
            var type = '';
            if (shift) type += 'shift';
            if (ctrl)  type += 'ctrl';
            if (alt)   type += 'alt';
            if (type == '') type = 'normal';
            var qwerty = tvfreebox.azerty2qwerty[type] ? tvfreebox.azerty2qwerty[type][cde] : void(0);
            if (tvfreebox.directAlphaKeys && (type == 'normal' || type == 'shift') && ((cde >= 48 && cde <= 57) || (cde >= 65 && cde <= 90) || qwerty)) {
                nb = 1;
                touche = qwerty ? qwerty : String.fromCharCode(cde).toLowerCase();
            }
            else {
                var keyData = tvfreebox.keys[type] ? tvfreebox.keys[type][cde] : void(0);
                if (typeof(keyData) != typeof(void(0))) {
                    var datas = keyData.split(',');
                    touche = datas[0];
                    nb = datas.length>1 ? Number(datas[1]) : 1;
                }
            }
            console.log('doKeyDown type=' + type + ', keyCode=' + cde + ', touche=' + touche);
            if (!tvfreebox.isKeyPressed && touche) {
                tvfreebox.keyUp();
                tvfreebox.isKeyPressed = true;
                tvfreebox.key = touche;
                if (nb == 1) {
                    var directPress = tvfreebox.contains(tvfreebox.directPress, touche);
                    if (tvfreebox.directAlphaKeys && (type == 'normal' || type == 'shift') && ((cde >= 48 && cde <= 57) || (cde >= 65 && cde <= 90) || qwerty)) {
                        directPress = true;
                    }
                    tvfreebox.keyPressTimeout = setTimeout(function() {
                        tvfreebox.sendKey(directPress, nb);
                    }, 500);
                }
                else {
                    tvfreebox.keyPressTimeout = setTimeout(function() {
                        tvfreebox.sendKey(false, nb);
                    }, 0);
                }
            }
            return false;
        },
        setTitle: function(enable) {
            console.log('setTitle', enable);
            var areas = document.getElementsByTagName('area');
            for (var i = 0; i < areas.length; i++) {
                var self = areas[i];
                var key = self.getAttribute('key');
                self.onmouseup = tvfreebox.keyUp;
                self.onmousedown = tvfreebox.pressKey;
                var title = self.getAttribute('title') || self.getAttribute('title_bak');
                if (enable) {
                    self.setAttribute('title', title);
                }
                else {
                    self.setAttribute('title_bak',  title);
                    self.setAttribute('title',  '');
                }
            }
        },
        doOnMouseScroll: function(event) {
            console.log('doOnMouseScroll', event);
            var detail = event.detail;
            if (detail) {
                clearTimeout(tvfreebox.scrollWhellTimeout);
                tvfreebox.scrollWhellTimeout = setTimeout(function() {
                    tvfreebox.pressKey(detail > 0 ? 'vol_dec' : 'vol_inc');
                }, 0);
                setTimeout(tvfreebox.keyUp, 0);
            }
        },
        setZoom: function(version, height) {
            console.log('setZoom', version, height);
            if (isNaN(height)) {
                height = 600;
            }
            var zoom = height / (version == 'v5' ? 2132 : version == 'v6' ? 2580 : 3433);
            for (var i = 1; i <= 2; i++) {
                var img = document.getElementById('tvfreebox_tvfreebox-popup' + i + '-image-' + version);
                if (img) {
                    if (height != img.height) {
                        img.height = height;
                        img.width = Math.round((version=='v5' ? 565 : version == 'v6' ? 654 : 823) * zoom);
                    }
                }
            }
            var lst = document.getElementById('tvfreebox_' + version + '-remoteURLmap').getElementsByTagName('area');
            for (var i = 0; i < lst.length; i++) {
                var coords = lst[i].getAttribute('originaleCoords');
                if (!coords) {
                    coords = lst[i].getAttribute('coords');
                    lst[i].setAttribute('originaleCoords', coords);
                }
                coords = coords.split(',');
                for (var j = 0; coord = coords[j]; j++) {
                    coords[j] = Math.round(coord*zoom);
                }
                lst[i].setAttribute('coords', coords.join(','));
            }
        },
        init: function() {
            console.log('init');
            if (isReady()) {
                tvfreebox.setZoom(tvfreebox.version, tvfreebox.zoom);
                if (tvfreebox.version == 'v5') {
                    document.getElementById('tvfreebox_tvfreebox-popup1-image-v5').style.display = '';
                    document.getElementById('tvfreebox_tvfreebox-popup1-image-v6').style.display = 'none';
                    document.getElementById('tvfreebox_tvfreebox-popup1-image-v7').style.display = 'none';
                    browser.browserAction.setIcon({path: "skin/v5/icon24.png"});
                }
                else if (tvfreebox.version == 'v6') {
                    document.getElementById('tvfreebox_tvfreebox-popup1-image-v5').style.display = 'none';
                    document.getElementById('tvfreebox_tvfreebox-popup1-image-v6').style.display = '';
                    document.getElementById('tvfreebox_tvfreebox-popup1-image-v7').style.display = 'none';
                    browser.browserAction.setIcon({path: "skin/v6/icon24.png"});
                }
                else {
                    document.getElementById('tvfreebox_tvfreebox-popup1-image-v5').style.display = 'none';
                    document.getElementById('tvfreebox_tvfreebox-popup1-image-v6').style.display = 'none';
                    document.getElementById('tvfreebox_tvfreebox-popup1-image-v7').style.display = '';
                    browser.browserAction.setIcon({path: "skin/v7/icon24.png"});
                }
                tvfreebox.setTitle(tvfreebox.help);
            }
            else {
                setTimeout(tvfreebox.init, 0);
            }
        }
    };
    browser.storage.local.set({'tvfreebox_version': tvfreebox.tvfreebox_version});
    getPref('keys', {"normal":{"8":"back","13":"ok","20":"swap","27":"power","32":"0","33":"prgm_inc","34":"prgm_dec","35":"blue","36":"green","37":"left","38":"up","39":"right","40":"down","45":"red","46":"yellow","48":"2,5","49":"7,6","50":"3,5","51":"1,7","52":"1,6","54":"1,5","55":"3,6","65":"2","66":"2,2","67":"2,3","68":"3","69":"3,2","70":"3,3","71":"4","72":"4,2","73":"4,3","74":"5","75":"5,2","76":"5,3","77":"6","78":"6,2","79":"6,3","80":"7","81":"7,2","82":"7,3","83":"7,4","84":"8","85":"8,2","86":"8,3","87":"9","88":"9,2","89":"9,3","90":"9,4","93":"list","96":"0","97":"1","98":"2","99":"3","100":"4","101":"5","102":"6","103":"7","104":"8","105":"9","106":"prgm_inc","107":"vol_inc","109":"vol_dec","110":"1","111":"prgm_dec","188":"1,2","192":"8,5","222":"tv","223":"1,4"},"shift":{"27":"mute","48":"0,2","49":"1,8","50":"2,4","51":"3,4","52":"4,4","53":"5,4","54":"6,4","55":"7,5","56":"8,4","57":"9,5","87":"play","88":"stop","65":"bwd","66":"bwd","70":"fwd","77":"mute","78":"next","80":"prev","81":"prev","83":"next","82":"rec","90":"fwd","96":"0,2","97":"1,8","98":"2,4","99":"3,4","100":"4,4","101":"5,4","102":"6,4","103":"7,5","104":"8,4","105":"9,5","188":"info","190":"mail","191":"help","192":"play","220":"stop","223":"pip"},"ctrl":{"17":"home"}});
    getPref('configs', []);
    getPref('label', 'principale');
    getPref('version', 'v7');
    getPref('boitier', '0');
    getPref('boitier_custom', 'http://freebox-player');
    getPref('code', '');
    getPref('zoom', '600');
    getPref('help', true);
    getPref('showicon', true);
    getPref('directAlphaKeys', true);
    tvfreebox.init();
    window.addEventListener('keydown', tvfreebox.doKeyDown, true);
    window.addEventListener('keyup', tvfreebox.keyUp, true);
    window.addEventListener('DOMMouseScroll', tvfreebox.doOnMouseScroll, true);

    function getPref(key, defaultValue) {
        browser.storage.local.get(key).then(function(item) {
            console.log('getPref', key, item);
            tvfreebox[key] = item[key] || defaultValue;
        }, function(error) {
            console.log('getPref error', key, error);
            tvfreebox.keys = defaultValue;
        });
    }
    
    function isReady() {
        var keys = ['keys', 'configs', 'label', 'version', 'boitier', 'boitier_custom', 'code', 'zoom', 'help', 'showicon', 'directAlphaKeys'];
        var result = true;
        for (var i = 0; result && i < keys.length; i++) {
            if (typeof(tvfreebox[keys[i]]) == typeof(void(0))) {
                result = false;
            }
        }
        return result;
    }
}
catch(e) {
    console.log(e);
}