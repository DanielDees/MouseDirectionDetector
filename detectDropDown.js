var map = new posMapper();
map.init('greyArea');

function posMapper () {

	//If in proper document element
	this.inElArea = false;

	//Mouse location
	this.pos = { X: 0, Y: 0, };
	//Stop location
	this.stopPos = { X: 0, Y: 0, };
	//Map location
	this.mapPos = { X: 0, Y: 0, };

	//Div attributes
	this.width = 60;
	this.height = 60;

	//Duration since last mouse move
	this.stopTime = 0;
	this.maxStopTime = 200;

	//Time between map updates
	this.updateTime = 10;

	//Maximum angle off map quadrant before reset
	this.maxAngle = 45;
	
	//Quadrant to check
	this.direction = {

		U: false,
		D: false,
		L: false,
		R: true,
	};

	this.init = function(el) {

		var that = this;
		var run = setInterval(function() { that.update(); }, that.updateTime);

		document.getElementById(el).onmouseover = function() {
			that.inElArea = true;
		};
		document.getElementById(el).onmouseleave = function() {
			that.inElArea = false;
		};
		document.onmousemove = function(e) {
			if (that.inElArea) {
				that.checkDirection(e.pageX, e.pageY);
			    that.pos.X = e.pageX;
			    that.pos.Y = e.pageY;
			}
		};
	};

	this.updatePointOnPage = function() {
		
		this.mapPos.X = this.pos.X;
		this.mapPos.Y = this.pos.Y;

		document.getElementById('mouseArea').style.left = this.pos.X - (this.width / 2) + "px";
		document.getElementById('mouseArea').style.top = this.pos.Y - (this.height / 2) + "px";
	};

	this.getAngle = function() {

	  //Calculate center of player.
	  var dx = this.mapPos.X - this.pos.X;
	  var dy = this.mapPos.Y - this.pos.Y;

	  //Find angle in Rad
	  var angle = Math.atan2(dx, dy);

	  //Convert from Rad to Degrees
	  angle *= (180 / Math.PI);

	  //Make angle positive on 360 degree values
	  angle += 180;

	  return angle;
	};

	this.checkDirection = function(newX, newY) {

		var angle = Math.abs(this.getAngle() - 90);
		document.getElementById('mouseArea').innerHTML = angle.toFixed(0);

		//If mouse is moving in correct direction
		if (this.direction.R && newX >= this.pos.X && angle < this.maxAngle) { return true; }
		else if (this.direction.L && newX <= this.pos.X) { return true; }
		else if (this.direction.U && newY >= this.pos.Y) { return true; }
		else if (this.direction.D && newY <= this.pos.Y) { return true; };

		//If mouse is not moving in correct direction
		this.updatePointOnPage();
		return false;
	};

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

		if (this.inElArea) {

			this.checkIfStopped();

			if (this.stopTime > this.maxStopTime) { 
				this.updatePointOnPage();
			};
		}
	};
}