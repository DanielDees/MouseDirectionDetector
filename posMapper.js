;"use strict";

function posMapper () {

	//If in proper document element
	this.inElArea = false;

	//Mouse location
	this.cursor = { X: 0, Y: 0, };
	//Stop location
	this.stopPos = { X: 0, Y: 0, };
	//Map location
	this.start = { X: 0, Y: 0, };

	//Div attributes
	this.width = 60;
	this.height = 60;

	//Duration since last mouse move
	this.stopTime = 0;
	this.maxStopTime = 200;

	//Time between map updates
	this.updateTime = 10;

	//Maximum angle off map quadrant before reset
	this.validMoveAngle = false;
	this.maxAngle = 45;
	this.quadrantAngles = {
		U: [135, 225],
		D: [315, 45],
		L: [225, 315],
		R: [45, 135],
	};
	
	//Quadrant to check
	this.direction = 'R';

	this.init = function(el) {

		var that = this;
		setInterval(function() { that.update(); }, that.updateTime);

		el.onmouseover = function() { that.inElArea = true; };
		el.onmouseleave = function() { that.inElArea = false; };
		
		document.onmousemove = function(e) {
			if (that.inElArea) {
				that.checkDirection(e.pageX, e.pageY);
			    that.cursor.X = e.pageX;
			    that.cursor.Y = e.pageY;

			   	that.callback(that);
			}
		};

		return this;
	};
	this.setCallback = function(fn) {	
		this.callback = fn;
		return this;
	};
	this.setMaxAngle = function(angle) {
		this.maxAngle = angle;
		return this;
	};
	this.setMaxStopTime = function(time) {
		this.maxStopTime = time;
		return this;
	};
	this.callback = function() {
		return this;
	};
	this.updateStartLocation = function() {
		
		this.start.X = this.cursor.X;
		this.start.Y = this.cursor.Y;

		document.getElementById('mouseArea').style.left = this.start.X - (this.width / 2) + "px";
		document.getElementById('mouseArea').style.top = this.start.Y - (this.height / 2)+ "px";
	};

	//Get whether or not mouse is moving in the correct direction/area
	this.isValidAngle = function() {

		var relative = this.maxAngle - 45;
		var angle = this.getAngle();

		var min = this.quadrantAngles[this.direction][0] - relative;
		var max = this.quadrantAngles[this.direction][1] + relative;

		if (this.direction != 'D' && angle >= min && angle <= max) { 
			return true;
		}
		else if (((angle >= 0 && angle <= max) || (angle >= min)) && this.direction == 'D') {
			return true; 
		}

		return false;
	}

	//Get angle of mouse movement in relation to the start position
	this.getAngle = function() {

	  //Calculate difference between start position and cursor position.
	  var dx = this.start.X - this.cursor.X;
	  var dy = this.start.Y - this.cursor.Y;

	  //Find angle in Rad
	  var angle = Math.atan2(dx, dy);

	  //Convert from Rad to Degrees
	  angle *= (180 / Math.PI);

	  //Make angle positive on 360 degree values
	  angle += 180;

	  return angle;
	};

	this.checkDirection = function(newX, newY) {

		document.getElementById('mouseArea').innerHTML = this.getAngle().toFixed(0);

		this.validMoveAngle = this.isValidAngle();

		//If mouse is moving in correct direction
		if (this.direction == 'R' && newX >= this.cursor.X && this.validMoveAngle) { return true; }
		else if (this.direction == 'L' && newX <= this.cursor.X && this.validMoveAngle) { return true; }
		else if (this.direction == 'D' && newY >= this.cursor.Y && this.validMoveAngle) { return true; }
		else if (this.direction == 'U' && newY <= this.cursor.Y && this.validMoveAngle) { return true; };

		//If mouse is not moving in correct direction
		this.updateStartLocation();
		return false;
	};

	this.checkIfStopped = function() {
		
		//If mouse has not moved then update the map area
		if (this.cursor.X == this.stopPos.X && this.cursor.Y == this.stopPos.Y) { 
			this.stopTime += this.updateTime;
			return true;
		}

		//If mouse has moved, then reset timer and update last position
		this.stopPos.X = this.cursor.X;
		this.stopPos.Y = this.cursor.Y;
		this.stopTime = 0;
		return false;
	};
	
	this.update = function() {

		if (this.inElArea) {

			this.checkIfStopped();

			if (this.stopTime > this.maxStopTime) { 
				this.updateStartLocation();
			};
		}
	};
};