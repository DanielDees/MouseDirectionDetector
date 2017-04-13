;"use strict";

var map = new posMapper();
map.init('id', 'services-dropdown').setMaxAngle(50).setMaxStopTime(350).setDirection('R').setCallback(function() { 
	if(this.validMoveAngle) {
		console.log("Check if a:hover and cancel if needed"); 
	}
});