;"use strict";

var map = new posMapper();
map.init('id', 'greyArea').setMaxAngle(45).setMaxStopTime(500).setCallback(function() { 
	if(this.validMoveAngle) { 
		console.log("Check if a:hover and cancel if needed"); 
	}
});