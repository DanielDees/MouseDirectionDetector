;"use strict";

var map = new posMapper();
map.init('greyArea').setMaxAngle(45).setMaxStopTime(1000).setCallback(function() { 
	if(this.blocking) { 
		console.log("Check if a:hover and cancel if needed"); 
	}
});