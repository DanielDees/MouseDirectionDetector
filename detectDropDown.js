var map = new posMapper();
map.init(map);

function posMapper () {

	//Map location
	//this.mapCenter { X: 0, Y: 0, };
	this.pos = { X: 0, Y: 0, };
	this.width = 100;
	this.height = 100;

	//Which quadrant to check
	this.direction = {

		U: false,
		D: false,
		L: false,
		R: false,
	};

	//Maximum angle off of map quadrant before reset
	//this.maxAngle = 45;

	this.init = function() {

		var that = this;
		var run = setInterval(function() { that.update(); }, 16);

		document.onmousemove = function(e) {

		    that.pos.X = e.pageX;
		    that.pos.Y = e.pageY;
		};
	};

	this.createMap = function() {
		
		
	};

	this.drawPointOnPage = function() {
		
		//Insert code here...
	};

	this.checkIfStopped = function() {
		
		//Insert code here...
	};
	
	this.update = function() {
		//Detect if mouse is moving
		//If not moving update the map area
		//If mouse reverses direction
		//Wait until it stops again and reset

		document.getElementById('mouseArea').style.marginLeft = this.pos.X - (this.width / 2) + "px";
		document.getElementById('mouseArea').style.marginTop = this.pos.Y - (this.height / 2) + "px";

		console.log("X: " + this.pos.X + "Y: " + this.pos.Y);
	};
}