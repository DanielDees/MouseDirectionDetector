;"use strict";

function posMapper () {

	//If in proper document element
	this.inElArea = false;
	this.el;
	this.elType;

	//Mouse location
	this.cursor = { X: 0, Y: 0, };
	//Stop location
	this.stopPos = { X: 0, Y: 0, };
	//Map location
	this.start = { X: 0, Y: 0, };

	//Div attributes
	this.width = function() { return this.get_el('id', 'mouseAreaY').style.width; };
	this.height = function() { return this.get_el('id', 'mouseAreaX').style.height; };

	//Duration since last mouse move
	this.stopTime = 0;
	this.maxStopTime = 200;

	//Time between map updates
	this.updateTime = 10;

	//Maximum angle off map quadrant before reset
	this.maxAngle = 45;

	this.quadrant = {
		U: 180,
		D: 0,
		L: 270,
		R: 90,
	};
	
	//Quadrant to check
	this.direction = 'D';

	this.init = function(type, el) {

		var that = this;
		setInterval(function() { that.update(); }, that.updateTime);

		this.el = el;
		this.elType = type;

		/* 
			TODO:

			The parent div ('nav') will have all of the child elements.
			When a childelement (each link in the nav) is mouseovered,
			Then do not trigger mouseout until the posMapper's map has
			been updated outside of the childelement.
			However the child element's children (dropdown links) need 
			to be considered a part of the main child element and used
			as part of the area that the posMapper's start location
			detects.
		*/
		this.get_el(type, el).onmouseover = function() { 
			that.inElArea = true; 

			console.log("posMapper start is in X/Y bounds!");
			var X = that.start.X;
			var Y = that.start.Y;
			var el = that.get_el(that.elType, that.el).getBoundingClientRect();
		
			if (X >= el.left && X <= el.right && Y >= el.top && Y <= el.bottom) {
				console.log("posMapper start is in X/Y bounds!");
			}
		};
		this.get_el(type, el).onmouseleave = function() { 
			that.inElArea = false; 
			console.log("posMapper start is NOT in X/Y bounds!"); 
		};

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
	this.setDirection = function(d) {
		this.direction = d;
		return this;
	};
	this.callback = function() {
		return this;
	};
	this.get_el = function(type, el) {

		if (type == "id") {
			return document.getElementById(el);
		}
		else if (type == "class") {
			return document.getElementsByClassName(el);
		}

		console.log("Couldn't get: " + type + " for " + el);
	};
	this.updateStartLocation = function() {
		
		this.start.X = this.cursor.X;
		this.start.Y = this.cursor.Y;

		this.get_el('id', 'mouseAreaX').style.top = this.start.Y + "px";
		this.get_el('id', 'mouseAreaY').style.left = this.start.X + "px";
	};

	//Get whether or not mouse is moving in the correct direction/area
	this.isValidAngle = function() {

		var angle = this.getAngle();

		var min = this.quadrant[this.direction] - this.maxAngle;
		var max = this.quadrant[this.direction] + this.maxAngle;

		if (this.direction != 'D' && angle >= min && angle <= max) { 
			return true;
		}
		else if ((angle <= max || angle >= 360 - this.maxAngle) && this.direction == 'D') {
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

		document.getElementById('mouseAreaX').innerHTML = this.getAngle().toFixed(0);

		var valid = this.isValidAngle();

		//If mouse is moving in correct direction
		if (this.direction == 'R' && newX >= this.cursor.X && valid) { return true; }
		else if (this.direction == 'L' && newX <= this.cursor.X && valid) { return true; }
		else if (this.direction == 'D' && newY >= this.cursor.Y && valid) { return true; }
		else if (this.direction == 'U' && newY <= this.cursor.Y && valid) { return true; };

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