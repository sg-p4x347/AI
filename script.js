// Script: AI
// Developer: Gage Coates
// Date: 9/28/2018

var application = new Application();

// gets called once the html is loaded
function Initialize() {
	application.Initialize();
}



function Application () {
	this.ctx;
	this.input = new Input();
	this.animationRequest;
	this.timeOfLastFrame;
	this.m_game = null;
	// update and render
	this.Update = function (elapsed) {
		this.m_game.Update(elapsed);
	};
	this.Animation = function () {
		var self = this;
		var elapsed = (Date.now() - self.timeOfLastFrame)/1000; // in seconds
		self.timeOfLastFrame = Date.now();
		self.Update(elapsed ? elapsed : 1/60);
		self.animationRequest = window.requestAnimFrame(function () {
			self.Animation();
		});
	}
	// initialize html and application components
	this.Initialize = function () {
		var self = this;
		
		// initialize the canvas variables
		var canvas = document.getElementById('canvas');
		self.ctx = canvas.getContext('2d');
		// image interpolation off for IE, Chrome, Firefox
		self.ctx.msImageSmoothingEnabled = false;
		self.ctx.imageSmoothingEnabled = false;
		self.ctx.mozImageSmoothingEnabled = false;
		// fit the canvas to the window size
		canvas.width  = (window.innerWidth-16) - canvas.getBoundingClientRect().left;
		canvas.height = (window.innerHeight-16) - canvas.getBoundingClientRect().top;
		
		
		
		self.input.Initialize(canvas);
		
		
		self.m_game = new Game(canvas,self.input);
		self.m_game.New();
		self.m_game.Play();
		
		// set up requestAnimFrame
		window.requestAnimFrame = (function () {
			return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000/60);
			};
		})();
		// start animation sequence
		self.Animation();
	}
}
// handle input events
function Input () {
	// input states
	this.keyMap = [];
	this.mouse = {
		x: 0,
		y: 0,
		left: false,
		middle: false,
		right: false
	}
	// application controls
	this.left = false;
	this.right = false;
	this.up = false;
	this.down = false;
	this.space = false;
	this.shift = false;
	this.escape = false;
	this.ctrl = false;
	// key bindings
	this.binding = {
		left: [65,37],
		right: [68,39],
		up: [87,38],
		down: [83,40],
		space: [32],
		shift: [16],
		escape: [27],
		ctrl: [17]
	}
	this.UpdateAction = function () {
		var self = this;
		for (var action in self.binding) {
			self.binding[action].some(function (keyCode) {
				if (self.keyMap[keyCode]) {
					self[action] = true;
					return true;
				} else {
					self[action] = false;
				}
			});
		}
	}
	this.Initialize = function (canvas) {
		var self = this;
		
		// set all keys to false
		for (var i = 0; i < 222; i++) {
			self.keyMap.push(false);
		}
		
		// add key listeners
		window.addEventListener('keydown', function (event) {
			event.preventDefault();
			self.keyMap[event.keyCode] = true;
			self.UpdateAction();
		});
		window.addEventListener('keyup', function (event) {
			event.preventDefault();
			self.keyMap[event.keyCode] = false;
			self.UpdateAction();
		});
		// add mouse listeners (only on the canvas)
		canvas.addEventListener('mousedown', function (event) {
			event.preventDefault();
			switch (event.which) {
				case 1: self.mouse.left = true; break;
				case 2: self.mouse.middle = true; break;
				case 3: self.mouse.right = true; break;
			}
		});
		canvas.addEventListener('mouseup', function (event) {
			event.preventDefault();
			switch (event.which) {
				case 1: self.mouse.left = false; break;
				case 2: self.mouse.middle = false; break;
				case 3: self.mouse.right = false; break;
			}
		});
		canvas.addEventListener('mousemove', function (event) {
			event.preventDefault();
			var rect = canvas.getBoundingClientRect();
			self.mouse.x = event.clientX - rect.left;
			self.mouse.y = event.clientY - rect.top;
		});
	}
}