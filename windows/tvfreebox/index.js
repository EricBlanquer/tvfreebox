function checkSettings(){
	var code = System.Gadget.Settings.read("code");
	if(code && code!="") {
		var version = System.Gadget.Settings.read("version");
		$("#bodyBackground").attr("src", version + "-face-32.png");
		$("#bodyBackground").height(124).show();
		$("#noSetText").hide();
		$(document.body).width(32).height(124); 
	} else {
		$("#bodyBackground").hide();
		$("#noSetText").show();
		$(document.body).width(171).height(117); 
	}
}
$(document).ready(function(){
	System.Gadget.Flyout.file = "Flyout.html";
	System.Gadget.settingsUI  = "Settings.html";
	System.Gadget.onSettingsClosed = checkSettings;
	System.Gadget.Flyout.onHide = function(){ $("#bodyBackground").show(); };
	System.Gadget.Flyout.onShow = function(){ $("#bodyBackground").hide(); };
	$("#bodyBackground").mouseup(function(){ System.Gadget.Flyout.show = !System.Gadget.Flyout.show; });
	checkSettings();
});