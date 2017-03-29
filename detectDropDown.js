var map = new posMapper();
map.init(map);

function posMapper () {

	//Map location
	this.pos = { X: 0, Y: 0, };

	//Stop location
	this.stopPos = { X: 0, Y: 0, };

	//Div attributes
	this.width = 100;
	this.height = 100;

	//Duration since last mouse move
	this.stopTime = 0;
	this.maxStopTime = 100;

	//Time between map updates
	this.updateTime = 16;

	//Maximum angle off map quadrant before reset
	//this.maxAngle = 45;
	
	//Quadrant to check
	this.direction = {

		U: false,
		D: false,
		L: false,
		R: true,
	};

	this.init = function() {

		var that = this;
		var run = setInterval(function() { that.update(); }, that.updateTime);

		document.onmousemove = function(e) {

			that.checkDirection(e.pageX, e.pageY);
		    that.pos.X = e.pageX;
		    that.pos.Y = e.pageY;
		};
	};

	this.updatePointOnPage = function() {
		
		document.getElementById('mouseArea').style.marginLeft = this.pos.X - (this.width / 2) + "px";
		document.getElementById('mouseArea').style.marginTop = this.pos.Y - (this.height / 2) + "px";
	};

	this.checkDirection = function(newX, newY) {

		//If mouse is moving in correct direction
		if (this.direction.R && newX >= this.pos.X) { return true; }
		else if (this.direction.L && newX <= this.pos.X) { return true; }
		else if (this.direction.U && newY >= this.pos.Y) { return true; }
		else if (this.direction.D && newY <= this.pos.Y) { return true; };
		
		//If mouse is not moving in correct direction
		this.updatePointOnPage();
		return false;
	}

	this.checkIfStopped = function() {
		
		//If mouse has not moved then update the map area
		if (this.pos.X == this.stopPos.X && this.pos.Y == this.stopPos.Y) { 
			
			this.stopTime += this.updateTime;
			return true;
		}

		//If mouse has moved, then reset timer and update last position
		this.stopPos.X = this.pos.X;
		this.stopPos.Y = this.pos.Y;
		this.stopTime = 0;
		return false;
	};
	
	this.update = function() {
		//Detect if mouse is moving
		//If not moving update the map area
		//If mouse reverses direction
		//Wait until it stops again and reset

		this.checkIfStopped();

		if (this.stopTime > this.maxStopTime) { 
			this.updatePointOnPage();
		};
	};
}