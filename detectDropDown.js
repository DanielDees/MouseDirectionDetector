;"use strict";

var map = new posMapper();
map.init('greyArea').setCallback(function() { 
	if(this.blocking) { 
		console.log("Check if a:hover and cancel if needed"); 
	}
});