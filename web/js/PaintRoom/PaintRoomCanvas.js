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
	maxPaintsPerSecond: 1000,
	
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
	 * @var PaintRoomClient
	 */
	paintRoomClient: null,
	
	/**
	 * Constructor.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param HtmlCanvas canvasElement The canvas to paint on.
	 */
	init: function(canvasElement, paintRoomClient) {
		this.paintRoomClient = paintRoomClient;
		this.canvas = $(canvasElement);
		this.canvasContext = this.canvas[0].getContext('2d');
		$(window).resize({that: this}, this.onWindowResize);
		this.resize();
		
		/* Mouse Capturing Work */
		this.canvas.bind( "mousemove", {that: this}, this.onCanvasMouseMove);
		this.canvas.bind( "mousedown", {that: this}, this.onCanvasMouseDown);
		this.canvas.bind( "mouseup", {that: this}, this.onCanvasMouseUp);
	},
	
	/**
	 * Calls the resize function if the window is resized.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param Event event The triggered event. 
	 */
	onWindowResize: function(event) {
		// Get class reference from event data
		var that = event.data.that;
		
		that.resize();
	},
	
	/**
	 * Resizes the canvas if the browser window gets resized.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 */
	resize: function() {
		var heightHeader = $('#paint-header').outerHeight(true);
		var heightFooter = $('#paint-controls').outerHeight(true);
		var heightWindow = $(window).innerHeight();
		var heightBody = heightWindow - heightHeader - heightFooter;
		$('#paint-sketch').attr('style', 'height: ' + heightBody + 'px;');
		$('#paint-member-list').attr('style', 'height: ' + (heightBody - 43) + 'px;');
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
	addPaintObject: function(paintObject, alreadySend) {
		this.unpaintedObjects.push(paintObject);
		
		if (! alreadySend) {
			var message = {path: 'paint', data: paintObject};
			this.paintRoomClient.sendMessage(message);
		}
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
		canvasContext.clearRect (0 , 0, this.canvas.width(), this.canvas.height());
		
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
		this.canvasContext.clearRect (0 , 0, this.canvas.width(), this.canvas.height());
		
		this.unpaintedObjects = [];
		this.paintedObjects = [];
	},
});