try {
    var tvfreebox = {
        //debug: true,
        checkCode: function(event) {
            console.log('checkCode');
            var input = event.target;
            input.style.backgroundColor = isNaN(input.value) ? 'red' : '';
        },
        checkOptions: function() {
            console.log('checkOptions');
            tvfreebox.resetOptionsMessages(true);
            var boitier = document.getElementById('tvfreebox_boitier').value;
            var code = document.getElementById('tvfreebox_code').value;
            var isV5  = document.getElementById('tvfreebox_version_v5').checked;
            var xhr = new XMLHttpRequest();
            var key = isV5 ? 'start' : 'back';
            var url;
            if (boitier == '0') {
                url = document.getElementById('tvfreebox_boitier_custom').value;
            }
            else {
                url = 'http://hd' + boitier + '.freebox.fr';
            }
            url += '/pub/remote_control?code=' + code + '&key=' + key + '&a=' + Math.random();
            console.log(url);
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            var t0 = new Date().getTime();
            xhr.onreadystatechange = function() {
                var t1 = new Date().getTime();
                console.log('onreadystatechange', xhr, t1 - t0);
                if (xhr.readyState == 4) {
                    tvfreebox.resetOptionsMessages();
                    if (xhr.status == 200) {
                        document.getElementById('tvfreebox_opt_mess_ok').style.display = '';
                    }
                    else if ((xhr.status == 0 || xhr.status == 500) && tvfreebox.checkOptTimeout) {
                        document.getElementById('tvfreebox_opt_mess_ok').style.display = '';
                        document.getElementById('tvfreebox_opt_mess_ok2').style.display = '';
                    }
                    else if (xhr.status == 403) {
                        document.getElementById('tvfreebox_opt_mess_code').style.display = '';
                    }
                    else if (xhr.status == 404) {
                        document.getElementById('tvfreebox_opt_mess_version').style.display = '';
                    }
                    if (tvfreebox.checkOptTimeout) {
                        clearTimeout(tvfreebox.checkOptTimeout);
                        tvfreebox.checkOptTimeout = void(0);
                    }
                }
            };
            tvfreebox.checkOptTimeout = setTimeout(tvfreebox.checkOptionsFailed, 1500);
            xhr.send();
        },
        checkOptionsFailed: function() {
            console.log('checkOptionsFailed');
            tvfreebox.checkOptTimeout = void(0);
            document.getElementById('tvfreebox_opt_mess_timeout').style.display = '';
        },
        resetOptionsMessages: function(forced) {
            console.log('resetOptionsMessages', forced);
            if (forced || tvfreebox.checkOptTimeout) {
                clearTimeout(tvfreebox.checkOptTimeout);
                document.getElementById('tvfreebox_opt_mess_ok').style.display = 'none';
                document.getElementById('tvfreebox_opt_mess_ok2').style.display = 'none';
                document.getElementById('tvfreebox_opt_mess_code').style.display = 'none';
                document.getElementById('tvfreebox_opt_mess_version').style.display = 'none';
                document.getElementById('tvfreebox_opt_mess_timeout').style.display = 'none';
            }
        },
        init: function() {
            console.log('init');
            if (isReady()) {
                document.getElementById('tvfreebox_version_v5').checked = tvfreebox.version == 'v5';
                document.getElementById('tvfreebox_version_v6').checked = tvfreebox.version == 'v6';
                document.getElementById('tvfreebox_version_v7').checked = tvfreebox.version == 'v7';
                document.getElementById('tvfreebox_boitier').value = tvfreebox.boitier;
                document.getElementById('tvfreebox_boitier_custom').value = tvfreebox.boitier_custom;
                document.getElementById('tvfreebox_code').value = tvfreebox.code;
                document.getElementById('tvfreebox_help').checked = tvfreebox.help;
                document.getElementById('tvfreebox_zoom').value = tvfreebox.zoom;
                document.getElementById('tvfreebox_version_v5').onclick = tvfreebox.savePrefs;
                document.getElementById('tvfreebox_version_v6').onclick = tvfreebox.savePrefs;
                document.getElementById('tvfreebox_version_v7').onclick = tvfreebox.savePrefs;
                document.getElementById('tvfreebox_boitier').onchange = tvfreebox.savePrefs;
                document.getElementById('tvfreebox_boitier_custom').onchange = tvfreebox.savePrefs;
                document.getElementById('tvfreebox_code').onchange = tvfreebox.savePrefs;
                document.getElementById('tvfreebox_help').onclick = tvfreebox.savePrefs;
                document.getElementById('tvfreebox_zoom').onchange = tvfreebox.savePrefs;
            }
            else {
                setTimeout(tvfreebox.init, 0);
            }
        },
        savePrefs: function() {
            console.log('savePrefs');
            setPref('version', document.getElementById('tvfreebox_version_v5').checked ? 'v5' : document.getElementById('tvfreebox_version_v6').checked ? 'v6' : 'v7');
            var boitier = document.getElementById('tvfreebox_boitier').value;
            setPref('boitier', boitier);
            setPref('boitier_custom', document.getElementById('tvfreebox_boitier_custom').value);
            setPref('code', document.getElementById('tvfreebox_code').value);
            setPref('help', document.getElementById('tvfreebox_help').checked);
            setPref('zoom', document.getElementById('tvfreebox_zoom').value);
            if (boitier == '0') {
                document.getElementById('tvfreebox_boitier_custom_zone').style.display = 'block';
            }
            else {
                document.getElementById('tvfreebox_boitier_custom_zone').style.display = 'none';
            }
        }
    };
    document.addEventListener('DOMContentLoaded', tvfreebox.init);
    document.getElementById('tvfreebox_code_test').onclick = tvfreebox.checkOptions;
    document.getElementById('tvfreebox_code').onkeyup = tvfreebox.checkCode;
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

    function getPref(key, defaultValue) {
        browser.storage.local.get(key).then(function(item) {
            console.log('getPref', key, item);
            tvfreebox[key] = item[key] || defaultValue;
        }, function(error) {
            console.log('getPref error', key, error);
            tvfreebox.keys = defaultValue;
        });
    }
    
    function setPref(key, value) {
        var datas = {};
        datas[key] = value;
        browser.storage.local.set(datas);
    }
    
    function isReady() {
        var keys = ['keys', 'configs', 'label', 'version', 'boitier', 'code', 'zoom', 'help', 'showicon', 'directAlphaKeys'];
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