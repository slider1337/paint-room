
/**
 * Represents an position of the mouse on the canvas.
 * 
 * @author Benedikt Schaller
 */
var PaintPosition = Class.extend({
	
	/**
	 * @access public
	 * @var int
	 */
	x: 0,
	
	/**
	 * @access public
	 * @var int
	 */
	y: 0,
	
	/**
	 * Constructor.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param int x The x position.
	 * @param int y The y position.
	 */
	init: function(x, y){
		this.x = x;
		this.y = y;
	},
});

/**
 * Represents a pencil moving over the canvas through various points.
 * 
 * @author Benedikt Schaller
 */
var PaintPencil = Class.extend({
	
	/**
	 * @access public
	 * @var PaintPosition
	 */
	positionStart: null,
	
	/**
	 * @access public
	 * @var PaintPosition
	 */
	positionEnd: null,
	
	/**
	 * Constructor.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param PaintPosition positionStart The beginning point of the pencil.
	 * @param PaintPosition positionEnd The end of the pencil.
	 */
	init: function(positionStart, positionEnd){
		this.positionStart = positionStart;
		this.positionEnd = positionEnd;
	},
	
	/**
	 * Paints the pencil line on the given canvas.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param HtmlCanvasContext canvasContext The context of the canvas to paint on.
	 */
	paint: function(canvasContext) {
		// Set properties for the pencil painting
		canvasContext.lineWidth = 5;
		canvasContext.lineJoin = 'round';
		canvasContext.lineCap = 'round';
		canvasContext.strokeStyle = 'blue';
		
		// Paint a line
		canvasContext.beginPath();
		canvasContext.moveTo(this.positionStart.x, this.positionStart.y);
		canvasContext.lineTo(this.positionEnd.x, this.positionEnd.y);
		canvasContext.closePath();
		canvasContext.stroke();
	},
});

/**
 * Strategy to paint like a pencil. If the PaintRoomCanvas uses
 * this strategy, the user can paint wit an pencil on the canvas.
 * 
 * @author Benedikt Schaller
 */
var PencilPaintStrategy = Class.extend({
	
	/**
	 * The last position on the mouse on the canvas while the current
	 * user was painting.
	 * 
	 * @access private
	 * @var PaintPosition
	 */
	lastPaintPosition: new PaintPosition(0, 0),
	
	/**
	 * Called on mouse down.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param PaintRoomCanvas paintRoomCanvas
	 * @return void
	 */
	mouseDown: function(paintRoomCanvas) {
		// save mouse down position as start of painting
		this.lastPaintPosition = new PaintPosition(paintRoomCanvas.mousePosition.x, paintRoomCanvas.mousePosition.y);
	},

	/**
	 * Called on mouse up.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param PaintRoomCanvas paintRoomCanvas
	 * @return void
	 */
	mouseUp: function(paintRoomCanvas) {
		
	},
	
	/**
	 * Called on mouse move.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param PaintRoomCanvas paintRoomCanvas
	 * @return void
	 */
	mouseMove: function(paintRoomCanvas) {
		// Get the context
		var canvasContext = paintRoomCanvas.canvasContext;
		
		// Create the pencil object to paint
		var positionStart = new PaintPosition(this.lastPaintPosition.x, this.lastPaintPosition.y);
		var positionEnd = new PaintPosition(paintRoomCanvas.mousePosition.x, paintRoomCanvas.mousePosition.y);
		var pencil = new PaintPencil(positionStart, positionEnd);
		paintRoomCanvas.addPaintObject(pencil);
		
		// Update paint position
		this.lastPaintPosition = new PaintPosition(paintRoomCanvas.mousePosition.x, paintRoomCanvas.mousePosition.y);
	},
});

/**
 * Represents the canvas in the paint room where the users can paint on.
 * 
 * @author Benedikt Schaller
 */
var PaintRoomCanvas = Class.extend({
	
	/**
	 * Holds all already painted objects.
	 * 
	 * @access private
	 * @var Array
	 */
	paintedObjects: [],
	
	/**
	 * Holds all objects that need to be painted.
	 * 
	 * @access private
	 * @var Array
	 */
	unpaintedObjects: [],
	
	/**
	 * @access private
	 * @var HtmlCanvas
	 */
	canvas: null,
	
	/**
	 * @access private
	 * @var HtmlCanvasContext
	 */
	canvasContext: null,
	
	/**
	 * The current position of the mouse on the canvas.
	 * 
	 * @access public
	 * @var PaintPosition
	 */
	mousePosition: new PaintPosition(0, 0),
	
	/**
	 * If true while mouse down.
	 * 
	 * @access private
	 * @var boolean
	 */
	isPainting: false,
	
	/**
	 * If set to false, the painting on the canvas will stop.
	 * 
	 * @access private
	 * @var boolean
	 */
	mayPaint: true,
	
	/**
	 * The last time (timestamp) a call to paint() was made.
	 * 
	 * @access private
	 * @var int
	 */
	lastPaintTime: (new Date()).getTime(),
	
	/**
	 * How much paint objects per second may be painted.
	 * 
	 * @access public
	 * @var int
	 */
	maxPaintsPerSecond: 48,
	
	/**
	 * A strategy that represents a paint tool. Needs following methods:
	 * - mouseUp(PaintRoomCanvas)
	 * - mouseDown(PaintRoomCanvas)
	 * - mouseMove(PaintRoomCanvas)
	 * 
	 * @access private
	 * @var Object
	 */
	paintStrategy: null,
	
	/**
	 * Constructor.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param HtmlCanvas canvasElement The canvas to paint on.
	 */
	init: function(canvasElement) {
		this.canvas = $(canvasElement);
		this.canvasContext = this.canvas[0].getContext('2d');
		
		/* Mouse Capturing Work */
		this.canvas.bind( "mousemove", {that: this}, this.onCanvasMouseMove);
		this.canvas.bind( "mousedown", {that: this}, this.onCanvasMouseDown);
		this.canvas.bind( "mouseup", {that: this}, this.onCanvasMouseUp);
	},
	
	/**
	 * Handler for mouse up events on the canvas.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param Event event The triggered event. 
	 */
	onCanvasMouseUp: function(event) {
		// Get class reference from event data
		var that = event.data.that;
		
		// Stop painting
		that.isPainting = false;
		
		// Call strategy
		if (that.paintStrategy != null) {
			that.paintStrategy.mouseUp(that);
		}
	},
	
	/**
	 * Handler for mouse down events on the canvas.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param Event event The triggered event. 
	 */
	onCanvasMouseDown: function(event) {
		// Get class reference from event data
		var that = event.data.that;
		
		// Start painting
		that.isPainting = true;

		// Call strategy
		if (that.paintStrategy != null) {
			that.paintStrategy.mouseDown(that);
		}
	},
	
	/**
	 * Handler for mouse move events on the canvas.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param Event event The triggered event. 
	 */
	onCanvasMouseMove: function(event) {
		// Get class reference from event data
		var that = event.data.that;
		
		// Always update the current mouse position
		var offset = that.canvas.offset();
		that.mousePosition.x = event.pageX - offset.left;
		that.mousePosition.y = event.pageY - offset.top;
		
		// If we are painting, we need to create an paint object for the movement
		if (that.isPainting) {
			// Call strategy
			if (that.paintStrategy != null) {
				that.paintStrategy.mouseMove(that);
			}
			
			// Start the painting
			that.paint(true);
		}
	},
	
	/**
	 * Adds a new object to be painted to the canvas.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param Object paintObject The object to be painted need an paint(HtmlCancasContext) method, that will be called to paint. 
	 */
	addPaintObject: function(paintObject) {
		this.unpaintedObjects.push(paintObject);
	},
	
	/**
	 * Stops the painting.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 */
	stopPainting: function() {
		this.mayPaint = false;
	},
	
	/**
	 * Starts the painting after beeing stopped.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 */
	startPainting: function() {
		this.mayPaint = true;
	},

	/**
	 * Paints the unpainted objects on the canvas.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param boolean forcePaint Bypass the paints per second limit if true. 
	 */
	paint: function(forcePaint = false) {
		var that = this;
		var paintWaitTime = 1000 / this.maxPaintsPerSecond;
		var now = (new Date()).getTime();
		
		// If painting currently deactivated, try again in half a sec
		if (! this.mayPaint) {
			setTimeout(function() { that.paint(); }, paintWaitTime);
			return;
		}
		
		// Ensure that there are not too much paintings
		if (! forcePaint) {
			if ((now - this.lastPaintTime) < paintWaitTime) {
				setTimeout(function() { that.paint(); }, (now - this.lastPaintTime));
				return;
			}
		}
		this.lastPaintTime = now;
		
		if (this.unpaintedObjects.length > 0) {
			// Remove the next item to paint
			var paintObject = this.unpaintedObjects.shift();

			// Get the context
			var canvasContext = this.canvasContext;
			
			// Let the pintObject paint itself on the context
			paintObject.paint(canvasContext);
			
			// Add the painted item to the painted objects
			this.paintedObjects.push(paintObject);
		}
		if (this.unpaintedObjects.length > 0) {
			setTimeout(function() { that.paint(); }, paintWaitTime);
			return;
		}
	},
	
	/**
	 * Redraw the picture from the scratch. 
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 */
	redraw: function() {
		// Stop paitning, so nothing interupts
		this.stopPainting();
		
		// Get the canvas
		var canvasContext = this.canvasContext;
		
		// First clear everything
		canvasContext.clearRect (0 , 0, 500, 500);
		
		// Now add all painted elements to the unpainted to let them be repainted
		while (this.paintedObjects.length > 0) {
			this.unpaintedObjects.unshift(this.paintedObjects.pop());
		}
		
		// Now paint everything again
		this.startPainting();
		this.paint();
	},
	
	/**
	 * Clears the image and deleted all painted objects. 
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 */
	clear: function() {
		this.canvasContext.clearRect (0 , 0, 500, 500);
		
		this.unpaintedObjects = [];
		this.paintedObjects = [];
	},
});

/**
 * Client to connect to a paint room server.
 * 
 * @author Benedikt Schaller
 */
var PaintRoomClient = Class.extend({
	
	/**
	 * @access private
	 * @var WebSocket 
	 */
	webSocket: null,
	
	/**
	 * Canvas view element to paint on.
	 * 
	 * @access private
	 * @var HtmlCanvas 
	 */
	canvas: null,
	
	/**
	 * View element that holds all paint room controls.
	 * 
	 * @access private
	 * @var HtmlDiv
	 */
	controls: null,
	
	/**
	 * Member list view element.
	 * 
	 * @access private
	 * @var HtmlDiv 
	 */
	memberList: null,
	
	/**
	 * Constructor
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param string host The server hostname.
	 * @param int port The port on which the server is running. 
	 */
	init: function(host, port){
		this.controls = $('#paint-controls');
		this.memberList = $('#paint-member-list');
		this.disableClient();

		// Setup canvas
		var canvas = $('#paint-canvas');
		this.canvas = new PaintRoomCanvas(canvas);
		this.setPaintStrategy(new PencilPaintStrategy());
		
		this.connect(host, port);
	},
	
	/**
	 * Create the connection to the server.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 * @param string host The server hostname.
	 * @param int port The port on which the server is running.
	 */
	connect: function(host, port) {
		this.webSocket = new WebSocket('ws://' + host + ':' + port + '/paintroom');
		this.webSocket.onopen = this.onOpenConnection;
		this.webSocket.onmessage = this.onReceiveMessage;
		
		// Needed to receive the PaintRoomClient in the websocket events
		this.webSocket.client = this;
	},
	
	/**
	 * Handler called after the server connection is opened.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 * @param Event event The triggered event.
	 */
	onOpenConnection: function(event) {
		// Get the PaintRoomClient object
		var that = this.client;
		
		// Enable the controls
		that.enableClient();
		
		// Log message
		console.log("Connection established!");
	},
	
	/**
	 * Handler called after a message from the server is received.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 * @param Event event The triggered event.
	 */
	onReceiveMessage: function(event) {
		// Get the PaintRoomClient object
		var that = this.client;
		
		// Handle the message
		//that.canvas.html(event.data);
	},
	
	/**
	 * Send an message to the server.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param mixed message The message to deliver.
	 */
	sendMessage: function(message) {
		this.webSocket.send(message);
	},
	
	/**
	 * Redraw the painting in the room.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 */
	redraw: function() {
		this.canvas.redraw();
	},
	
	/**
	 * Clears the current picture.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 */
	clear: function() {
		this.canvas.clear();
	},
	
	/**
	 * Sets the current paint strategy/tool.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param Object paintStrategy The strategy/tool to use for painting.
	 */
	setPaintStrategy: function(paintStrategy) {
		this.canvas.paintStrategy = paintStrategy;
	},
	
	/**
	 * Returns the currently used paint strategy/tool.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @return Object
	 */
	getPaintStrategy: function() {
		return this.canvas.paintStrategy;
	},

	/**
	 * Disbales the client controls.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 */
	disableClient: function() {
		this.controls.find('input, button').prop('disabled', true);
		this.memberList.css('background-color', 'gray');
	},
	
	/**
	 * Enables the client controls.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 */
	enableClient: function() {
		this.controls.find('input, button').prop('disabled', false);
		this.memberList.css('background-color', 'green');
	},
});