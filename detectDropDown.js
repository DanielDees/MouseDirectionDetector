var map = new posMapper();
map.init(map);

function posMapper () {

	this.pos = { X: 0, Y: 0, };

	this.init = function() {

		var that = this;
		var run = setInterval(function() { that.update(); }, 16);

		document.onmousemove = function(e) {

		    that.pos.X = e.pageX;
		    that.pos.Y = e.pageY;
		};
	};

	this.update = function() {

		console.log("X: " + this.pos.X + "Y: " + this.pos.Y);
	};
}